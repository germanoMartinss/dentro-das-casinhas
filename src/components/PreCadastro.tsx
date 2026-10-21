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

/**
 * Destino depois do envio. A API pode devolver a URL pronta (url, urlRetorno,
 * redirectUrl) ou só o código (codigo, code), que vai como ?codigo= na página
 * "Bem-vindo". Só aceita endereços do mesmo domínio da página "Bem-vindo".
 */
function urlDeRetorno(dados: unknown): string | null {
  if (!dados || typeof dados !== "object") return null;
  const d = dados as Record<string, unknown>;
  const base = new URL(PRE_CADASTRO.bemVindoUrl);

  const pronta = [d.url, d.urlRetorno, d.redirectUrl].find((v) => typeof v === "string");
  if (typeof pronta === "string") {
    try {
      const url = new URL(pronta, base);
      return url.origin === base.origin ? url.href : null;
    } catch {
      return null;
    }
  }

  const codigo = [d.codigo, d.code].find((v) => typeof v === "string" || typeof v === "number");
  if (codigo === undefined) return null;
  base.searchParams.set("codigo", String(codigo));
  return base.href;
}

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
    if (PRE_CADASTRO.turnstileSiteKey && !token) {
      setStatus("erro");
      setMensagem(
        verificacaoFalhou
          ? "A verificação de segurança não carregou. Use o link abaixo para seguir pela página Bem-vindo."
          : "Aguarde a verificação de segurança terminar e envie de novo.",
      );
      return;
    }

    setStatus("enviando");
    setMensagem("");
    try {
      const resposta = await fetch(PRE_CADASTRO.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nome.trim().replace(/\s+/g, " "),
          telefone: digitosTelefone(telefone),
          turnstileToken: token,
        }),
        signal: AbortSignal.timeout(TEMPO_LIMITE_MS),
      });
      if (!resposta.ok) throw resposta;
      const destino = urlDeRetorno(await resposta.json().catch(() => null));
      if (!destino) throw new Error("Resposta sem URL de retorno");
      setStatus("redirecionando");
      window.location.assign(destino);
    } catch (falha) {
      if (widgetId.current) window.turnstile?.reset(widgetId.current);
      setToken("");
      setStatus("erro");
      const codigo = falha instanceof Response ? falha.status : 0;
      setMensagem(
        codigo === 429
          ? "Recebemos muitas tentativas seguidas. Aguarde um minuto e tente de novo."
          : codigo === 400 || codigo === 422
            ? "Não conseguimos aceitar esses dados. Confira o nome e o telefone e tente de novo."
            : "Não conseguimos concluir o pré-cadastro agora. Tente de novo em instantes.",
      );
    }
  }

  const ocupado = status === "enviando" || status === "redirecionando";
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

          {PRE_CADASTRO.turnstileSiteKey && <div ref={turnstileRef} className="min-h-[65px]" />}

          <button
            type="submit"
            disabled={ocupado}
            className="bg-terracotta-strong text-white font-extrabold rounded-full px-6 py-3.5 text-[17px] shadow-cta hover:bg-terracotta-deep disabled:opacity-80 disabled:cursor-wait transition-colors"
          >
            {status === "enviando"
              ? "Enviando…"
              : status === "redirecionando"
                ? "Abrindo a página Bem-vindo…"
                : "Continuar o pré-cadastro"}
          </button>

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
                <p className="font-bold text-ink mb-1">{mensagem}</p>
                <p className="text-ink-soft">
                  Se preferir, siga direto pela{" "}
                  <a
                    href={PRE_CADASTRO.bemVindoUrl}
                    className="font-bold text-terracotta-deep underline underline-offset-2"
                  >
                    página Bem-vindo da clínica
                  </a>
                  .
                </p>
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
