#!/usr/bin/env node
/**
 * Desempenho do build de produção:
 *   1) Lighthouse mobile com o throttling padrão ("4G lento" simulado:
 *      150ms de RTT, 1,6 Mbps, CPU 4x mais lenta); mediana de N execuções.
 *   2) Peso total transferido rolando a página inteira em 390px (todas as
 *      imagens lazy carregadas), por tipo de recurso.
 *
 *   npm run test:perf
 *   npm run test:perf -- --execucoes 3
 *
 * Rode contra `npm run build && npm start` (não contra `npm run dev`).
 * O resultado também é salvo em tools/.output/perf/<data>.json.
 */
import fs from "node:fs";
import path from "node:path";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { BASE_URL, OUTPUT, browserPath, ensureDir, launchBrowser, parseArgs, requireServer } from "./lib.mjs";

const args = parseArgs();
const runs = Number(args.execucoes ?? 5);
const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const kb = (bytes) => Math.round(bytes / 1024);

await requireServer();

// 1) Lighthouse
const results = [];
for (let i = 0; i < runs; i++) {
  process.stdout.write(`Lighthouse ${i + 1}/${runs}...\r`);
  const chrome = await chromeLauncher.launch({ chromePath: browserPath(), chromeFlags: ["--headless=new"] });
  const { lhr } = await lighthouse(BASE_URL, { port: chrome.port, onlyCategories: ["performance"], output: "json", logLevel: "error" });
  const audit = (id) => lhr.audits[id].numericValue;
  results.push({
    nota: lhr.categories.performance.score * 100,
    lcp: audit("largest-contentful-paint"),
    fcp: audit("first-contentful-paint"),
    cls: audit("cumulative-layout-shift"),
    tbt: audit("total-blocking-time"),
    pesoInicial: audit("total-byte-weight"),
    elementoLcp: lhr.audits["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]?.node?.snippet,
  });
  await chrome.kill();
}

// 2) peso total rolando a página (transferSize = bytes trafegados, já comprimidos)
const browser = await launchBrowser();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto(BASE_URL, { waitUntil: "networkidle" });
const height = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < height; y += 300) {
  await page.evaluate((top) => window.scrollTo(0, top), y);
  await page.waitForTimeout(80);
}
await page.waitForLoadState("networkidle");
await page.waitForTimeout(500);
// recursos de outra origem (o iframe do mapa) vêm com transferSize 0 e ficam de fora
const byType = await page.evaluate(() => {
  const out = {};
  const add = (key, value) => (out[key] = (out[key] ?? 0) + value);
  add("documento", performance.getEntriesByType("navigation")[0].transferSize);
  for (const entry of performance.getEntriesByType("resource")) {
    if (!entry.name.startsWith(location.origin)) continue;
    const key = entry.name.includes("/_next/image") || /\.(png|jpe?g|webp|avif|svg|ico)/.test(entry.name)
      ? "imagens"
      : /\.woff2?/.test(entry.name) ? "fontes" : /\.css/.test(entry.name) ? "css" : /\.js/.test(entry.name) ? "js" : "outros";
    add(key, entry.transferSize);
  }
  return out;
});
await browser.close();

const summary = {
  url: BASE_URL,
  data: new Date().toISOString(),
  lighthouse: {
    execucoes: runs,
    nota: median(results.map((r) => r.nota)),
    lcp_ms: Math.round(median(results.map((r) => r.lcp))),
    fcp_ms: Math.round(median(results.map((r) => r.fcp))),
    cls: Number(median(results.map((r) => r.cls)).toFixed(3)),
    tbt_ms: Math.round(median(results.map((r) => r.tbt))),
    pesoInicial_kb: kb(median(results.map((r) => r.pesoInicial))),
    elementoLcp: results[0].elementoLcp,
  },
  paginaInteira390_kb: {
    total: kb(Object.values(byType).reduce((sum, v) => sum + v, 0)),
    ...Object.fromEntries(Object.entries(byType).map(([key, value]) => [key, kb(value)])),
  },
};

const file = path.join(ensureDir(path.join(OUTPUT, "perf")), `${summary.data.replace(/[:.]/g, "-")}.json`);
fs.writeFileSync(file, JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
console.log(`\nSalvo em ${path.relative(process.cwd(), file)}`);
