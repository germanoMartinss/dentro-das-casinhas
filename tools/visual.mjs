#!/usr/bin/env node
/**
 * Regressão visual: captura a página inteira (390px e 1440px, modo claro e
 * escuro) e compara pixel a pixel com uma referência salva antes.
 *
 *   npm run test:visual:referencia   salva a referência (rode ANTES da mudança)
 *   npm run test:visual              captura de novo e compara com a referência
 *
 * Opções:
 *   --larguras 390,1440   larguras a capturar
 *   --tolerancia 0        % de pixels diferentes aceita por captura (padrão 0)
 *   --atualizar           salva a captura atual como referência e sai
 *
 * Também salva o HTML normalizado (sem scripts e hashes de build) e mostra o
 * diff do markup quando ele muda. Saída em tools/.output/visual/.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { BASE_URL, OUTPUT, ensureDir, launchBrowser, loadWholePage, parseArgs, requireServer } from "./lib.mjs";

const args = parseArgs();
const widths = String(args.larguras ?? "390,1440").split(",").map(Number);
const tolerance = Number(args.tolerancia ?? 0);
const SCHEMES = ["light", "dark"];
const DIR = path.join(OUTPUT, "visual");
const REF = path.join(DIR, "referencia");
const CUR = path.join(DIR, "atual");

/** Normaliza o HTML do build para comparar só o markup visível. */
function normalizeHtml(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/g, "")
    .replace(/<link\b[^>]*>/g, "")
    .replace(/\/_next\/static\/[^"' )]+/g, "/_next/static/X")
    .replace(/[a-z0-9_]+-module__[A-Za-z0-9_]+__variable/g, "FONTVAR")
    .replace(/\?[a-z-]+\.[a-z0-9_-]+\.(jpg|png|ico)/g, "")
    .replaceAll("><", ">\n<");
}

async function capture(outDir) {
  fs.rmSync(outDir, { recursive: true, force: true });
  ensureDir(outDir);
  const browser = await launchBrowser();
  const metrics = {};
  for (const scheme of SCHEMES) {
    for (const width of widths) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: scheme });
      const page = await context.newPage();
      await page.goto(BASE_URL, { waitUntil: "networkidle" });
      await loadWholePage(page);
      // remove fontes de ruído: transições/animações e o conteúdo do iframe do mapa
      await page.addStyleTag({
        content: "*,*::before,*::after{transition:none!important;animation:none!important;caret-color:transparent!important} iframe{visibility:hidden!important}",
      });
      await page.waitForTimeout(300);
      metrics[`${scheme}-${width}`] = await page.evaluate(() => ({
        altura: document.documentElement.scrollHeight,
        rolagemHorizontal: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        elementosDom: document.getElementsByTagName("*").length,
      }));
      await page.screenshot({ path: path.join(outDir, `${scheme}-${width}.png`), fullPage: true });
      await context.close();
    }
  }
  await browser.close();
  const html = await (await fetch(BASE_URL)).text();
  fs.writeFileSync(path.join(outDir, "pagina.html"), normalizeHtml(html));
  fs.writeFileSync(path.join(outDir, "metricas.json"), JSON.stringify(metrics, null, 2));
  return metrics;
}

/** Compara duas PNGs; devolve % de pixels diferentes e as faixas verticais alteradas. */
function compare(fileA, fileB, diffFile) {
  const a = PNG.sync.read(fs.readFileSync(fileA));
  const b = PNG.sync.read(fs.readFileSync(fileB));
  const width = Math.max(a.width, b.width);
  const height = Math.max(a.height, b.height);
  const pad = (img) => {
    if (img.width === width && img.height === height) return img;
    const padded = new PNG({ width, height });
    padded.data.fill(255);
    PNG.bitblt(img, padded, 0, 0, img.width, img.height, 0, 0);
    return padded;
  };
  const diff = new PNG({ width, height });
  const pixels = pixelmatch(pad(a).data, pad(b).data, diff.data, width, height, { threshold: 0.1 });
  fs.writeFileSync(diffFile, PNG.sync.write(diff));

  const bands = [];
  let start = -1;
  for (let y = 0; y <= height; y++) {
    let changed = false;
    for (let x = 0; y < height && x < width && !changed; x++) {
      const i = (y * width + x) * 4;
      changed = diff.data[i] === 255 && diff.data[i + 1] === 0 && diff.data[i + 2] === 0;
    }
    if (changed && start < 0) start = y;
    if (!changed && start >= 0) {
      bands.push(`${start}-${y - 1}`);
      start = -1;
    }
  }
  return {
    alturas: `${a.height} → ${b.height}`,
    pct: (100 * pixels) / (width * height),
    faixas: bands,
  };
}

await requireServer();

if (args.atualizar) {
  const metrics = await capture(REF);
  console.log(`Referência salva em ${path.relative(process.cwd(), REF)} (${BASE_URL})`);
  console.table(metrics);
  process.exit(0);
}

if (!fs.existsSync(path.join(REF, "metricas.json"))) {
  console.error("Nenhuma referência salva. Rode `npm run test:visual:referencia` antes da mudança.");
  process.exit(1);
}

const metrics = await capture(CUR);
console.table(metrics);

let failed = false;
for (const scheme of SCHEMES) {
  for (const width of widths) {
    const name = `${scheme}-${width}`;
    const refFile = path.join(REF, `${name}.png`);
    if (!fs.existsSync(refFile)) {
      console.log(`${name}: sem referência nessa largura, ignorado`);
      continue;
    }
    const r = compare(refFile, path.join(CUR, `${name}.png`), path.join(CUR, `${name}-diff.png`));
    const ok = r.pct <= tolerance;
    failed ||= !ok;
    const bands = r.faixas.length ? ` | faixas (y): ${r.faixas.slice(0, 12).join(", ")}${r.faixas.length > 12 ? ", …" : ""}` : "";
    console.log(`${ok ? "✓" : "✗"} ${name}: ${r.pct.toFixed(3)}% dos pixels | altura ${r.alturas}${bands}`);
  }
}

// diff do markup (git diff funciona fora de repositório com --no-index)
const htmlDiff = spawnSync(
  "git",
  ["diff", "--no-index", "--stat", path.join(REF, "pagina.html"), path.join(CUR, "pagina.html")],
  { encoding: "utf8" },
);
console.log(htmlDiff.stdout.trim() ? `\nHTML mudou:\n${htmlDiff.stdout}` : "\nHTML: markup idêntico");
if (htmlDiff.stdout.trim()) {
  console.log(`Detalhes: git diff --no-index ${path.relative(process.cwd(), REF)}/pagina.html ${path.relative(process.cwd(), CUR)}/pagina.html`);
}

console.log(`\nDiffs em ${path.relative(process.cwd(), CUR)} (pixels alterados em vermelho em *-diff.png)`);
process.exit(failed ? 1 : 0);
