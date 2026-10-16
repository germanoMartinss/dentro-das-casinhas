#!/usr/bin/env node
/**
 * Varredura de larguras: redimensiona a página de 320px a 1440px (passo de
 * 1px) e aponta onde aparece rolagem horizontal e qual elemento a causa.
 *
 *   npm run test:larguras
 *   npm run test:larguras -- --de 320 --ate 1920 --passo 5
 *
 * Sai com código 1 se houver rolagem horizontal em alguma largura.
 */
import { BASE_URL, launchBrowser, parseArgs, requireServer } from "./lib.mjs";

const args = parseArgs();
const from = Number(args.de ?? 320);
const to = Number(args.ate ?? 1440);
const step = Number(args.passo ?? 1);

await requireServer();
const browser = await launchBrowser();
const page = await browser.newPage({ viewport: { width: to, height: 800 } });
await page.goto(BASE_URL, { waitUntil: "networkidle" });
// carrega as imagens lazy, que podem mudar o layout
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 500) {
    window.scrollTo(0, y);
    await new Promise((resolve) => setTimeout(resolve, 30));
  }
});

const problems = [];
for (let width = from; width <= to; width += step) {
  await page.setViewportSize({ width, height: 800 });
  const result = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    if (sw <= vw) return null;
    // culpado: o elemento mais externo que passa da borda direita fora de um overflow escondido
    const clipped = (el) => {
      for (let a = el.parentElement; a; a = a.parentElement) {
        const o = getComputedStyle(a).overflowX;
        if (o === "hidden" || o === "clip") return true;
      }
      return false;
    };
    const over = [...document.querySelectorAll("body *")].filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width && r.right > vw + 0.5 && !clipped(el);
    });
    const outermost = over
      .filter((el) => !over.includes(el.parentElement))
      .map((el) => `<${el.tagName.toLowerCase()} class="${String(el.className).slice(0, 60)}">`);
    return { excess: sw - vw, culprits: [...new Set(outermost)].join(" ") || "(não identificado)" };
  });
  if (result) problems.push({ width, ...result });
}
await browser.close();

if (!problems.length) {
  console.log(`✓ Sem rolagem horizontal de ${from}px a ${to}px (passo ${step}px)`);
  process.exit(0);
}

// agrupa larguras contíguas com o mesmo culpado
let start = problems[0];
let maxExcess = start.excess;
for (let i = 1; i <= problems.length; i++) {
  const current = problems[i];
  const previous = problems[i - 1];
  if (current && current.width === previous.width + step && current.culprits === start.culprits) {
    maxExcess = Math.max(maxExcess, current.excess);
    continue;
  }
  console.log(`✗ ${start.width}-${previous.width}px: até ${maxExcess}px de rolagem | ${start.culprits}`);
  if (current) {
    start = current;
    maxExcess = current.excess;
  }
}
process.exit(1);
