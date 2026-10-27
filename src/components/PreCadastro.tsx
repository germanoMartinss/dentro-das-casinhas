"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { PRE_CADASTRO } from "@/lib/site";
import { digitosTelefone, mascaraTelefone, telefoneValido } from "@/lib/telefone";

/** Evento disparado pelos botões "Faça o pré-cadastro" (PreCadastroButton). */
export const ABRIR_PRE_CADASTRO = "pre-cadastro:abrir";

const TURNSTILE_SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const TEMPO_LIMITE_MS = 15000;

type Turnstile = {
  render: (el: HTMLElement, opcoes: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

// O script do Turnstile só é baixado quando alguém abre o formulário.
let turnstilePromise: Promise<Turnstile> | null = null;
function carregarTurnstile(): Promise<Turnstile> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  turnstilePromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = TURNSTILE_SCRIPT;
    script.async = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject());
    script.onerror = () => {
      turnstilePromise = null;
      script.remove();
      reject();
    };
    document.head.appendChild(script);
  });
  return turnstilePromise;
}

/** Lê um campo de texto do JSON de resposta da API (url ou message). */
async function campoDaResposta(resposta: Response, campo: "url" | "message"): Promise<string> {
  const dados: unknown = await resposta.json().catch(() => null);
  const valor = dados && typeof dados === "object" ? (dados as Record<string, unknown>)[campo] : null;
  return typeof valor === "string" ? valor.trim() : "";
}

/** URL de retorno (página "Bem-vindo" com o código); só aceita http(s). */
function urlSegura(valor: string): string | null {
  try {
    const url = new URL(valor);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

const MENSAGEM_FALHA = "Não conseguimos concluir o pré-cadastro agora. Tente de novo em instantes.";

type Status = "preenchendo" | "enviando" | "redirecionando" | "erro";
type Erros = { nome?: string; telefone?: string };

function validar(nome: string, telefone: string): Erros {
  const erros: Erros = {};
  if (!nome.trim()) erros.nome = "Informe o nome do responsável.";
  else if (nome.trim().replace(/[^\p{L}]/gu, "").length < 3) erros.nome = "Informe o nome completo.";
  if (!digitosTelefone(telefone)) erros.telefone = "Informe um telefone ou WhatsApp.";
  else if (!telefoneValido(telefone)) erros.telefone = "Confira o número com DDD, ex.: (13) 98214-6166.";
  return erros;
}

const CAMPO =
  "w-full rounded-xl border-2 bg-white px-4 py-3 text-base text-ink placeholder:text-ink-muted/70 focus-visible:outline-offset-1";

/**
 * Formulário de pré-cadastro ("Bem-vindo à Casinha") num <dialog> modal: o
 * navegador cuida do foco preso, do Esc e de devolver o foco a quem abriu.
 * Fica montado uma vez na página e abre pelo evento ABRIR_PRE_CADASTRO.
 */
export default function PreCadastro() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  const [aberto, setAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [status, setStatus] = useState<Status>("preenchendo");
  const [mensagem, setMensagem] = useState("");
  const [mostrarLink, setMostrarLink] = useState(false);
  // Campo isca (honeypot): invisível para pessoas, só robôs o preenchem.
  const iscaRef = useRef<HTMLInputElement>(null);
  const [token, setToken] = useState("");
  const [verificacaoFalhou, setVerificacaoFalhou] = useState(false);

  useEffect(() => {
    function abrir() {
      dialogRef.current?.showModal();
      document.getElementById("pre-cadastro-nome")?.focus();
      setAberto(true);
    }
    window.addEventListener(ABRIR_PRE_CADASTRO, abrir);
    return () => window.removeEventListener(ABRIR_PRE_CADASTRO, abrir);
  }, []);

  // Widget do Turnstile: criado ao abrir, removido ao fechar (o token vale uma vez).
  useEffect(() => {
    if (!aberto || !PRE_CADASTRO.turnstileSiteKey) return;
    let cancelado = false;
    carregarTurnstile()
      .then((turnstile) => {
        if (cancelado || !turnstileRef.current) return;
        widgetId.current = turnstile.render(turnstileRef.current, {
          sitekey: PRE_CADASTRO.turnstileSiteKey,
          language: "pt-br",
          size: "flexible",
          callback: (t: string) => {
            setToken(t);
            setVerificacaoFalhou(false);
          },
          "expired-callback": () => setToken(""),
          "error-callback": () => {
            setToken("");
            setVerificacaoFalhou(true);
          },
        });
      })
      .catch(() => !cancelado && setVerificacaoFalhou(true));
    return () => {
      cancelado = true;
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
      setToken("");
    };
  }, [aberto]);

  const fechar = useCallback(() => dialogRef.current?.close(), []);

  function aoFechar() {
    setAberto(false);
    if (status !== "redirecionando") setStatus("preenchendo");
  }

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "enviando" || status === "redirecionando") return;
    setTentouEnviar(true);
    const novosErros = validar(nome, telefone);
    setErros(novosErros);
    if (novosErros.nome || novosErros.telefone) {
      const campo = novosErros.nome ? "pre-cadastro-nome" : "pre-cadastro-telefone";
      document.getElementById(campo)?.focus();
      return;
    }
    if (aguardandoVerificacao) return;

    setStatus("enviando");
    setMensagem("");

    // Contrato da API: { nome, telefone, turnstile, site }. Resposta 201 com { url }.
    let resposta: Response;
    try {
      resposta = await fetch(PRE_CADASTRO.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nome.trim().replace(/\s+/g, " "),
          telefone: digitosTelefone(telefone),
          turnstile: token,
          site: iscaRef.current?.value ?? "",
        }),
        signal: AbortSignal.timeout(TEMPO_LIMITE_MS),
      });
    } catch {
      // Falha de rede ou tempo esgotado.
      mostrarErro(MENSAGEM_FALHA, true);
      return;
    }

    if (resposta.status === 201) {
      const destino = urlSegura(await campoDaResposta(resposta, "url"));
      if (destino) {
        setStatus("redirecionando");
        window.location.assign(destino);
        return;
      }
      mostrarErro(MENSAGEM_FALHA, true);
      return;
    }

    switch (resposta.status) {
      case 400:
        mostrarErro("Confira os dados e tente de novo.");
        break;
      case 404:
        mostrarErro("O link está incorreto. Peça o link atualizado à clínica.");
        break;
      case 403:
      case 429:
      case 503:
        mostrarErro((await campoDaResposta(resposta, "message")) || MENSAGEM_FALHA);
        break;
      default:
        mostrarErro(MENSAGEM_FALHA, true);
    }
  }

  // O token do Turnstile vale para uma única verificação: depois de qualquer
  // erro (em especial o 403), o widget é reiniciado e gera um token novo.
  function mostrarErro(texto: string, comLink = false) {
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
    setToken("");
    setStatus("erro");
    setMensagem(texto);
    setMostrarLink(comLink);
  }

  const ocupado = status === "enviando" || status === "redirecionando";
  // O botão só libera quando o widget do Turnstile devolve o token.
  const aguardandoVerificacao = Boolean(PRE_CADASTRO.turnstileSiteKey) && !token;
  const errosVisiveis = tentouEnviar ? erros : {};

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="pre-cadastro-titulo"
      aria-describedby="pre-cadastro-apoio"
      onClose={aoFechar}
      onClick={(e) => e.target === dialogRef.current && fechar()}
      className="m-auto w-[min(100%-32px,480px)] max-h-[calc(100dvh-32px)] overflow-y-auto rounded-3xl bg-cream bg-grid p-0 text-ink shadow-[0_24px_60px_rgba(61,58,52,0.35)] backdrop:bg-ink/70"
    >
      <div className="relative px-6 pt-8 pb-6 sm:px-9">
        <button
          type="button"
          onClick={fechar}
          aria-label="Fechar"
          className="absolute top-3 right-4 text-ink-muted text-4xl leading-none font-bold px-2 hover:text-terracotta-deep transition-colors"
        >
          &times;
        </button>

        <p className="font-hand text-[28px] text-terracotta-deep font-bold leading-none mb-1">
          pré-cadastro
        </p>
        <h2 id="pre-cadastro-titulo" className="font-heading font-extrabold text-[30px] leading-tight mb-2">
          Bem-vindo à Casinha
        </h2>
        <p id="pre-cadastro-apoio" className="text-ink-soft mb-6">
          Primeiro passo para o seu filho fazer parte da Casinha.
        </p>

        <form noValidate onSubmit={enviar} aria-busy={ocupado} className="flex flex-col gap-4">
          <div>
            <label htmlFor="pre-cadastro-nome" className="block font-bold mb-1.5">
              Nome do responsável
            </label>
            <input
              id="pre-cadastro-nome"
              name="nome"
              type="text"
              autoComplete="name"
              autoCapitalize="words"
              required
              maxLength={120}
              value={nome}
              disabled={ocupado}
              onChange={(e) => {
                setNome(e.target.value);
                if (tentouEnviar) setErros(validar(e.target.value, telefone));
              }}
              aria-invalid={Boolean(errosVisiveis.nome)}
              aria-describedby={errosVisiveis.nome ? "pre-cadastro-nome-erro" : undefined}
              className={`${CAMPO} ${errosVisiveis.nome ? "border-terracotta-deep" : "border-ink/15"}`}
            />
            {errosVisiveis.nome && (
              <p id="pre-cadastro-nome-erro" className="text-terracotta-deep font-bold text-sm mt-1.5">
                {errosVisiveis.nome}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="pre-cadastro-telefone" className="block font-bold mb-1.5">
              Telefone / WhatsApp
            </label>
            <input
              id="pre-cadastro-telefone"
              name="telefone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="(13) 90000-0000"
              required
              value={telefone}
              disabled={ocupado}
              onChange={(e) => {
                const mascarado = mascaraTelefone(e.target.value);
                setTelefone(mascarado);
                if (tentouEnviar) setErros(validar(nome, mascarado));
              }}
              aria-invalid={Boolean(errosVisiveis.telefone)}
              aria-describedby={errosVisiveis.telefone ? "pre-cadastro-telefone-erro" : undefined}
              className={`${CAMPO} ${errosVisiveis.telefone ? "border-terracotta-deep" : "border-ink/15"}`}
            />
            {errosVisiveis.telefone && (
              <p id="pre-cadastro-telefone-erro" className="text-terracotta-deep font-bold text-sm mt-1.5">
                {errosVisiveis.telefone}
              </p>
            )}
          </div>

          <div aria-hidden="true" className="absolute -left-[10000px] top-auto w-px h-px overflow-hidden">
            <label htmlFor="pre-cadastro-site">Site (deixe em branco)</label>
            <input
              id="pre-cadastro-site"
              ref={iscaRef}
              name="site"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
            />
          </div>

          {PRE_CADASTRO.turnstileSiteKey && <div ref={turnstileRef} className="min-h-[65px]" />}

          <button
            type="submit"
            disabled={ocupado || aguardandoVerificacao}
            aria-describedby={aguardandoVerificacao ? "pre-cadastro-aguardando" : undefined}
            className={`bg-terracotta-strong text-white font-extrabold rounded-full px-6 py-3.5 text-[17px] shadow-cta hover:bg-terracotta-deep disabled:hover:bg-terracotta-strong transition-colors ${ocupado ? "disabled:opacity-80 disabled:cursor-wait" : "disabled:opacity-60 disabled:cursor-not-allowed"}`}
          >
            {status === "enviando"
              ? "Enviando…"
              : status === "redirecionando"
                ? "Abrindo a página Bem-vindo…"
                : "Continuar o pré-cadastro"}
          </button>

          {aguardandoVerificacao && !ocupado && (
            <p id="pre-cadastro-aguardando" className="text-ink-soft text-sm text-center -mt-2">
              {verificacaoFalhou ? (
                <>
                  A verificação de segurança não carregou. Recarregue a página ou siga pela{" "}
                  <a
                    href={PRE_CADASTRO.bemVindoUrl}
                    className="font-bold text-terracotta-deep underline underline-offset-2"
                  >
                    página Bem-vindo da clínica
                  </a>
                  .
                </>
              ) : (
                "Aguardando a verificação de segurança…"
              )}
            </p>
          )}

          <div aria-live="polite" className="empty:hidden">
            {status === "enviando" && (
              <p className="text-ink-soft text-sm text-center">Um instante, estamos registrando seus dados.</p>
            )}
            {status === "redirecionando" && (
              <p className="text-ink-soft text-sm text-center">
                Tudo certo! Levando você para a página Bem-vindo…
              </p>
            )}
            {status === "erro" && (
              <div className="rounded-2xl bg-white border-2 border-terracotta/40 px-4 py-3 text-sm">
                <p className="font-bold text-ink">{mensagem}</p>
                {mostrarLink && (
                  <p className="text-ink-soft mt-1">
                    Se preferir, siga direto pela{" "}
                    <a
                      href={PRE_CADASTRO.bemVindoUrl}
                      className="font-bold text-terracotta-deep underline underline-offset-2"
                    >
                      página Bem-vindo da clínica
                    </a>
                    .
                  </p>
                )}
              </div>
            )}
          </div>
        </form>

        <p className="text-ink-muted text-xs leading-relaxed mt-5">
          Seus dados serão usados apenas para o pré-cadastro e para o contato da clínica, conforme a
          Lei Geral de Proteção de Dados (LGPD).
        </p>
      </div>
    </dialog>
  );
}
