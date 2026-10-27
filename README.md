# Dentro Das Casinhas

Landing page da **Dentro Das Casinhas**, clínica multidisciplinar de Praia Grande (SP) especializada em intervenção para crianças neurodivergentes. É uma página única, estática, com as seções Sobre, Galeria, Terapias, Convênios, Localização e Depoimentos.

Produção: https://dentro-das-casinhas.vercel.app (deploy automático na Vercel a cada push na `main`).

## Stack

| | |
|---|---|
| Framework | Next.js 16.3 (App Router, Turbopack), React 19.2 |
| Estilo | Tailwind CSS 4 (configuração via CSS, em `src/app/globals.css`) |
| Linguagem | TypeScript 5 (`strict`) |
| Fontes | Baloo 2 (títulos), Nunito (texto) e Caveat (detalhes manuscritos), via `next/font/google` |
| Imagens | `next/image`; `sharp` nos scripts de geração de assets |
| Qualidade | ESLint 9 + `eslint-config-next` (core-web-vitals + typescript) |

Não há bibliotecas de UI, de animação nem de analytics.

## Como rodar

Requer Node.js 20.11 ou superior.

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run build        # build de produção
npm start            # serve o build de produção
```

Variáveis de ambiente:

| Variável | Uso | Padrão |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública usada em canonical, Open Graph, sitemap, robots e JSON-LD | `https://dentro-das-casinhas.vercel.app` |
| `NEXT_PUBLIC_PRE_CADASTRO_API_URL` | Endpoint do pré-cadastro ("Bem-vindo à Casinha") no sistema da clínica | `https://api.187-127-58-73.sslip.io/api/publico/bem-vindo/dentro-das-casinhas/iniciar` |
| `NEXT_PUBLIC_BEM_VINDO_URL` | Página "Bem-vindo" do sistema: destino depois do envio e link alternativo se a API falhar | `https://ababase.vercel.app/bem-vindo/dentro-das-casinhas` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Chave pública do Cloudflare Turnstile. Sem ela o widget não aparece e o token vai vazio | (vazia) |

São todas lidas no build: depois de mudar qualquer uma na Vercel (por exemplo, ao ligar um domínio próprio no site ou no sistema), faça um novo deploy.

### Pré-cadastro

Os botões "Faça o pré-cadastro" (cabeçalho e seção "Conheça a Casinha") abrem o formulário em `src/components/PreCadastro.tsx`. O envio é um `POST` JSON direto do navegador:

```json
{ "nome": "Maria Souza", "telefone": "13982146166", "turnstile": "<token>", "site": "" }
```

`site` é um campo isca (honeypot), oculto para pessoas: só robôs o preenchem. Na resposta `201`, o site redireciona para o campo `url` (página "Bem-vindo" com o código). Em `403`, `429` e `503` mostra o `message` da API; em `400`, "Confira os dados e tente de novo."; em `404`, pede o link atualizado à clínica; em falha de rede ou erro inesperado, mostra o link direto da página "Bem-vindo". O botão de envio só libera quando o Turnstile devolve o token, e o widget é reiniciado depois de qualquer erro (o token vale uma vez). A API precisa liberar o domínio do site no CORS.

## Testes (pasta `tools/`)

Os testes rodam contra o site no ar. Use o build de produção:

```bash
npm run build && npm start      # em outro terminal
```

| Comando | O que faz |
|---|---|
| `npm run test:visual:referencia` | Captura a página (390px e 1440px, modo claro e escuro) e salva como referência. Rode **antes** de mudar algo |
| `npm run test:visual` | Captura de novo e compara pixel a pixel com a referência; também compara o HTML. Mostra as faixas da página que mudaram e falha se houver diferença |
| `npm run test:a11y` | axe-core + testes de teclado (skip link, percurso completo de Tab, lightbox, FAQ, faixa de convênios, menu mobile) e de movimento reduzido |
| `npm run test:perf` | Lighthouse mobile em 4G lento (mediana de 5 execuções), peso total transferido e CLS acumulado rolando a página |
| `npm run test:larguras` | Varre de 320px a 1440px procurando rolagem horizontal e aponta o elemento culpado |

Opções úteis:

- `BASE_URL=http://localhost:3300 npm run test:a11y`: testa outra URL. O padrão é `http://localhost:3000`.
- `npm run test:visual -- --tolerancia 0.1`: aceita até 0,1% de pixels diferentes.
- `npm run test:perf -- --execucoes 3`: muda o número de execuções do Lighthouse.
- `npm run test:larguras -- --de 320 --ate 1920 --passo 5`: muda a faixa e o passo da varredura.

Os testes precisam de um Chrome/Chromium. Eles usam `CHROME_PATH`, se estiver definido; senão, o Chromium do Playwright (`npx playwright install chromium`); senão, o Chrome instalado no sistema. Screenshots, diffs e relatórios ficam em `tools/.output/`, pasta ignorada pelo git.

## Estrutura

```
src/
  app/
    layout.tsx           <html>, fontes e metadata (SEO, Open Graph, Twitter)
    page.tsx             monta as seções, skip link e JSON-LD
    globals.css          tokens de design (cores, sombras, fontes) e estilos base
    sitemap.ts, robots.ts
    opengraph-image.jpg, twitter-image.jpg, icon.png, apple-icon.png, favicon.ico
  components/            uma seção por arquivo + peças client (menu, lightbox, FAQ, contador, animações)
  data/                  conteúdo editável: terapias, convênios, fotos, menu, passos, FAQ, equipe, depoimentos
  lib/
    site.ts              nome, URL, telefone, WhatsApp, endereço, redes, link do formulário, anos de cuidado
    json-ld.ts           dados estruturados MedicalClinic (schema.org)
  types/                 tipos compartilhados
tools/                   testes: visual, acessibilidade, desempenho, larguras
scripts/
  normalizar-logo.mjs    padroniza logos de convênio
  gerar-imagens-seo.mjs  gera imagem de Open Graph, favicon e ícones
public/images/
  casinha/               fotos da galeria (1.jpg a 20.jpg)
  convenios/             logos de convênio padronizados (320x144)
  logo-ink.png, logo-white.png
```

## Como atualizar o conteúdo

**Contatos (telefone, endereço, redes sociais, link de agendamento):** edite `src/lib/site.ts`. O rodapé, a seção Localização, o link `tel:`, o mapa e o JSON-LD leem dali. Ao trocar o telefone, atualize os dois campos (`display` e `e164`, no formato `+55DDDNÚMERO`).

**Terapias:** edite `src/data/terapias.ts`. Cada item tem `title`, `description`, `color` (`slate`, `mustard`, `sage` ou `terracotta`) e `icon` (`puzzle`, `speech`, `hand`, `heart`, `footprints` ou `book`). Um ícone novo precisa ser desenhado em `src/components/Terapias.tsx` e incluído no tipo `TherapyIcon`.

**Convênios:** os logos precisam passar pelo script de padronização, que recorta as margens do arquivo original e centraliza o logo numa tela transparente de tamanho fixo. Assim todos usam a mesma regra de CSS.

```bash
npm run logo:normalizar -- ~/Downloads/unimed.png public/images/convenios/unimed.png --altura 34
```

Use `--altura` (ou `--largura`) para definir o tamanho visual em px. Como referência, os logos atuais têm de 18px (Mediservice, que é bem horizontal) a 64px (Life) de altura. Depois, adicione `{ name, logo }` em `src/data/convenios.ts`. Use sempre um **nome de arquivo novo** ao substituir um logo, para que o cache de imagens (do Next e dos navegadores) não sirva a versão antiga.

**Fotos da galeria:** coloque o JPG em `public/images/casinha/` (de preferência 1440px no lado maior) e adicione o texto alternativo em `src/data/fotos.ts`. A lista de alts define a ordem e a quantidade de fotos. O alt descreve o ambiente; se aparecer uma criança, descreva a cena sem identificá-la.

**Menu:** `src/data/navegacao.ts`. O `href` precisa ser o `id` de uma seção. Equipe, Depoimentos e Dúvidas só entram no menu quando têm dados.

**Seções que dependem de dados da clínica** (cada uma só aparece quando tem conteúdo):

| Arquivo | O que preencher |
|---|---|
| `src/data/faq.ts` | Respostas com `answer: null` ficam fora do site; o campo `todo` diz o que falta |
| `src/data/equipe.ts` | `{ name, specialty, registration, photo }` (foto quadrada em `public/images/equipe/`, com autorização) |
| `src/data/depoimentos.ts` | `{ quote, author, relation }`, só depoimentos reais e autorizados |
| `src/data/como-funciona.ts` | Textos dos 4 passos (revisar com a clínica) |
| `src/lib/site.ts` | `GOOGLE_FORM_URL` (link de agendamento), `YEARS_OF_CARE` e confirmação do WhatsApp |

**Imagem de compartilhamento e ícones:** depois de trocar o logo, ou para usar outra foto (`OG_PHOTO` no script), rode `npm run seo:imagens`. O script garante que o JPEG de Open Graph fique abaixo de 300 KB.

## Decisões técnicas

- **Tokens de design no tema do Tailwind, com contraste AA.** Todas as cores e sombras ficam em `@theme` (`globals.css`). As cores vivas da marca (terracota #D9713C, mostarda, sálvia, ardósia) ficam para destaques gráficos (toldo, ícones, fitas). Botões usam `terracotta-strong` (#B8582A, 4,7:1 com branco) com hover em `terracotta-deep` (#9A4520), que também é a cor dos textos de destaque. Ícones sobre cores claras são escuros.
- **Estilos globais em `@layer base`.** Regras fora de uma layer vencem as utilities do Tailwind, que ficam em `@layer utilities`. Era isso que anulava a Nunito no texto.
- **Server Components por padrão.** Rodam no cliente só: o cabeçalho (menu mobile e encolhimento), o lightbox, a sanfona do FAQ, o contador da faixa de confiança, o botão de pausa da faixa de convênios e o `RevealOnScroll`. As miniaturas da galeria são renderizadas no servidor, e o lightbox captura o clique por delegação de eventos.
- **Bandeirinhas em SVG.** Um `<pattern>` substitui as 100 `div`s por faixa, com o mesmo desenho e a mesma fase (o padrão começa no centro). Só essa mudança levou a página de 461 para 275 elementos.
- **Logos de convênio padronizados no arquivo**, não no CSS. Cada marca tem um tamanho visual próprio, que fica definido no PNG gerado pelo script em vez de num `transform: scale()` por item.
- **Foto do hero com `preload` e `sizes`.** O `priority` foi depreciado no Next 16. Medido: com ou sem o `preload` da foto o LCP é o mesmo (o elemento de LCP é o parágrafo do hero, que depende da fonte).
- **Animações só com CSS e um IntersectionObserver**, sem bibliotecas, só com `transform`/`opacity` e dentro de `prefers-reduced-motion: no-preference`:
  - **Entrada ao rolar (`RevealOnScroll`):** o HTML chega com tudo visível. Depois da hidratação, só o que ainda está abaixo da dobra é escondido, até entrar na tela. O hero nunca é escondido, e nada depende de JS para aparecer. Se o foco do teclado cair num bloco ainda escondido, ele aparece na hora.
  - **Header:** encolhe só com `transform`, dentro de um contêiner sticky de altura fixa, então o conteúdo não se desloca (CLS 0 rolando a página).
  - **Faixa de convênios:** pausa no hover, no foco e por um botão (WCAG 2.2.2, que também atende quem usa toque). Com "reduzir movimento", vira uma grade parada.
  - **Contador da faixa de confiança:** o HTML já traz o número final.
- **Conteúdo que depende da clínica nunca é inventado.** FAQ sem resposta, Equipe e Depoimentos ficam fora do site (e do menu) até haver dados.
- **Ano do rodapé com ISR.** A página é estática e revalida a cada 24h (`revalidate = 86400`), para o ano mudar sem deploy.
- **Acessibilidade sem mudança visual:**
  - skip link
  - `aria-label` nos dois `nav`
  - seções rotuladas pelos títulos
  - foco visível (`:focus-visible`, branco nas seções escuras)
  - `prefers-reduced-motion` respeitado
  - menu e lightbox operáveis por teclado

## Problemas encontrados e como foram resolvidos

| Problema | Solução |
|---|---|
| Next 16.2.12 com 1 vulnerabilidade crítica e 4 altas (`npm audit --omit=dev`) | Atualizado para 16.3.8, mais `npm audit fix` sem `--force`: **0 vulnerabilidades em produção**. Restam 5 altas só em dev (`braces`, via `eslint-config-next`), ainda sem correção publicada |
| Regra `body` fora de `@layer` anulava a Nunito (o texto saía em Arial) e criava um modo escuro acidental | Estilos globais em `@layer base`; bloco de modo escuro do template removido |
| 10 assets sem uso (5 PNGs, incluindo uma duplicata exata, e 5 SVGs do template) | Removidos |
| Cores em hex espalhadas pelos componentes; `--foreground` diferente da cor de texto usada | Tokens no tema; `--foreground` = `#3D3A34` |
| Endereço e telefone duplicados em Footer e Localização | Centralizados em `src/lib/site.ts` |
| ~200 `div`s de bandeirinhas | Padrão SVG |
| Logos da marca declarados com proporção errada (ex.: 270x88 para um arquivo 399x501), causando layout shift | Dimensões a partir da proporção real; CLS 0,011 → 0 |
| Logo da Bradesco com 4096px (180 KB) e `scale()` manual em cada convênio | Logos padronizados em 320x144; 276 KB → 92 KB |
| Rolagem horizontal de 320px a 379px (mapa com `min-w-[380px]`) | `min(380px, 100%)`; varredura de 320 a 1440px sem rolagem |
| Erro "Boqueião" na URL do mapa | URL gerada a partir do endereço |
| Menu mobile e lightbox inacessíveis por teclado; dois `h2` num só título; alts genéricos | Ver "Acessibilidade" acima; alts descritivos nas 20 fotos |
| Sem Open Graph, sitemap, robots, dados estruturados nem ícones próprios | Implementados (etapa de SEO) |

Medição no build de produção, antes (commit `670293e`) e depois. Lighthouse mobile com 4G lento simulado, mediana de 5 execuções; peso total medido rolando a página inteira em 390px:

| | Antes | Depois |
|---|---|---|
| Performance (Lighthouse) | 95 | 96 |
| LCP | 2,93 s | 2,86 s |
| CLS | 0,011 | 0 |
| Peso no carregamento inicial | 493 KB | 474 KB |
| Peso total (página inteira) | 606 KB | 520 KB |
| Elementos no DOM | 479 | 288 |
| Violações do axe-core | 1 regra (contraste, 20 nós) | 1 regra (contraste, 20 nós; fica para a fase 2) |

## Fase 2 (concluída)

Visual mais profissional, mantendo a identidade (paleta, toldo, polaroids, Baloo 2, Nunito e Caveat):

- **Cores:** todo texto passa AA. As 21 combinações que falhavam passam; o axe-core não aponta violações.
- **Hero:** duas colunas, com foto em polaroid e faixa de confiança com contador.
- **Seções novas:** Como funciona, FAQ em sanfona, Equipe e Depoimentos (só com dados reais) e CTA final.
- **Animações:** toldo, entrada ao rolar, polaroids, faixa de convênios, header e cards.
- **WhatsApp:** botão flutuante e links no contato, atrás da flag `WHATSAPP_CONFIRMADO`.

Medição no build de produção, antes (commit `250f386`) e depois da fase 2. Lighthouse mobile com 4G lento simulado, mediana de 5 execuções:

| | Antes | Depois |
|---|---|---|
| Performance (Lighthouse) | 95 | 97 |
| LCP | 2,93 s | 2,63 s |
| FCP | 0,91 s | 1,21 s |
| CLS no carregamento | 0 | 0 |
| CLS rolando a página inteira (390px) | 0 | 0 |
| Peso total (página inteira) | 520 KB | 475 KB |
| Violações do axe-core | 1 regra (contraste, 20 nós) | nenhuma |

Com o hero novo, o LCP chegou a 3,28 s. O elemento de LCP é o parágrafo do hero, que depende da fonte Nunito. Duas mudanças de fonte o trouxeram para 2,63 s:

- carregar só os pesos usados: Baloo 2 700/800, Nunito 400/700/800 e Caveat 700;
- tirar o preload da Caveat, que só aparece em detalhes.

O FCP subiu ~300 ms nesse ajuste.

## Pendências que dependem da clínica

1. **Link de agendamento.** `GOOGLE_FORM_URL` em `src/lib/site.ts` ainda é `"#"`; todos os botões "Agende uma visita" usam esse valor.
2. ~~**WhatsApp.**~~ Confirmado pela clínica: `WHATSAPP_CONFIRMADO = true` em `src/lib/site.ts`. Para desligar, volte para `false`.
3. **FAQ.** Respostas sobre a faixa etária atendida e sobre a primeira visita; atendimento particular e reembolso (TODOs em `src/data/faq.ts`).
4. **Equipe.** Fotos autorizadas, nomes, especialidades e registros profissionais (`src/data/equipe.ts`).
5. **Depoimentos.** Relatos reais, com autorização das famílias (`src/data/depoimentos.ts`).
6. **Textos de "Como funciona".** Revisar para refletirem o processo real (`src/data/como-funciona.ts`).
7. **LGPD.**
   - Falta política de privacidade.
   - O mapa do Google carrega sem consentimento e pode gravar cookies de terceiros.
   - O formulário de agendamento vai coletar dados de crianças e de saúde, que são dados sensíveis.
