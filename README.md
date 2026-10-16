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

Variável de ambiente opcional:

| Variável | Uso | Padrão |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública usada em canonical, Open Graph, sitemap, robots e JSON-LD | `https://dentro-das-casinhas.vercel.app` |

Ao ligar um domínio próprio, defina `NEXT_PUBLIC_SITE_URL` na Vercel e faça um novo deploy.

## Estrutura

```
src/
  app/
    layout.tsx           <html>, fontes e metadata (SEO, Open Graph, Twitter)
    page.tsx             monta as seções, skip link e JSON-LD
    globals.css          tokens de design (cores, sombras, fontes) e estilos base
    sitemap.ts, robots.ts
    opengraph-image.jpg, twitter-image.jpg, icon.png, apple-icon.png, favicon.ico
  components/            uma seção por arquivo; só Header e GaleriaLightbox são client
  data/                  conteúdo editável: terapias, convênios, fotos, links do menu
  lib/
    site.ts              nome, URL, telefone, endereço, redes, link do formulário
    json-ld.ts           dados estruturados MedicalClinic (schema.org)
  types/                 tipos compartilhados
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

**Menu:** `src/data/navegacao.ts`. O `href` precisa ser o `id` de uma seção.

**Imagem de compartilhamento e ícones:** depois de trocar o logo, ou para usar outra foto (`OG_PHOTO` no script), rode `npm run seo:imagens`. O script garante que o JPEG de Open Graph fique abaixo de 300 KB.

## Decisões técnicas

- **Tokens de design no tema do Tailwind.** Todas as cores e sombras ficam em `@theme` (`globals.css`), com os mesmos valores do layout original. Há dois tons de terracota com papéis diferentes: `terracotta` (#D9713C, a cor da marca, em botões e destaques) e `terracotta-band` (#C9683A, fundo das faixas do Hero e Convênios). O hover dos botões usa `terracotta-hover`.
- **Estilos globais em `@layer base`.** Regras fora de uma layer vencem as utilities do Tailwind, que ficam em `@layer utilities`. Era isso que anulava a Nunito no texto.
- **Server Components por padrão.** Só o menu mobile (`Header`) e o lightbox (`GaleriaLightbox`) rodam no cliente. As miniaturas da galeria são renderizadas no servidor, e o lightbox captura o clique por delegação de eventos.
- **Bandeirinhas em SVG.** Um `<pattern>` substitui as 100 `div`s por faixa, com o mesmo desenho e a mesma fase (o padrão começa no centro). Só essa mudança levou a página de 461 para 275 elementos.
- **Logos de convênio padronizados no arquivo**, não no CSS. Cada marca tem um tamanho visual próprio, que fica definido no PNG gerado pelo script em vez de num `transform: scale()` por item.
- **Logo do hero sem `preload`.** O elemento de LCP é o parágrafo do hero (texto). Pré-carregar o logo disputou banda com as fontes e piorou o LCP em ~150ms (Lighthouse, 4G lento), então os dois logos do topo usam `loading="eager"`. O `priority` foi depreciado no Next 16.
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

## Fase 2 (pendente)

Estes pontos ficaram de fora de propósito, porque dependem de decisões de design ou de informações da clínica:

1. **Contraste de cores.** 20 elementos abaixo de 4.5:1 (axe-core), entre eles o botão principal (branco sobre terracota, 3.29:1), os kickers em terracota sobre creme (2.80:1) e o título "A CULTURA DA CASINHA" (1.74:1).
2. **CTAs "Agende uma visita".** `GOOGLE_FORM_URL` em `src/lib/site.ts` ainda é `"#"`, então os 4 botões não levam a lugar nenhum.
3. **Depoimentos.** Os 3 textos são ilustrativos e o aviso aparece no site. Faltam relatos reais, com autorização das famílias.
4. **WhatsApp.** Não há botão nem link `wa.me`.
5. **LGPD.**
   - Falta política de privacidade.
   - O mapa do Google carrega sem consentimento e pode gravar cookies de terceiros.
   - O formulário de agendamento vai coletar dados de crianças e de saúde, que são dados sensíveis.
6. **Hero.** Revisão do layout (a faixa com o logo repete o logo do cabeçalho).
