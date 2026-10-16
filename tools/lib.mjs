// Utilitários compartilhados pelas ferramentas de teste em tools/.
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

export const ROOT = path.resolve(import.meta.dirname, "..");
/** Saídas (screenshots, diffs, relatórios). Ignorado pelo git. */
export const OUTPUT = path.join(ROOT, "tools/.output");

/** URL do site a testar. Padrão: o `npm start` local. */
export const BASE_URL = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

const SYSTEM_BROWSERS = [
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
];

/**
 * Navegador usado nos testes, nesta ordem: CHROME_PATH, o Chromium do
 * Playwright (npx playwright install chromium) ou um Chrome/Chromium do sistema.
 */
export function browserPath() {
  const candidates = [process.env.CHROME_PATH, chromium.executablePath(), ...SYSTEM_BROWSERS];
  const found = candidates.find((p) => p && fs.existsSync(p));
  if (!found) {
    fail("Nenhum Chrome/Chromium encontrado. Rode `npx playwright install chromium` ou defina CHROME_PATH.");
  }
  return found;
}

export function launchBrowser() {
  return chromium.launch({ executablePath: browserPath() });
}

/** Encerra com erro se o site não estiver respondendo em BASE_URL. */
export async function requireServer() {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch (err) {
    fail(
      `O site não respondeu em ${BASE_URL} (${err.message}).\n` +
        "Rode `npm run build && npm start` em outro terminal, ou defina BASE_URL.",
    );
  }
}

/** Rola a página inteira para carregar as imagens lazy e espera todas terminarem. */
export async function loadWholePage(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 400) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForFunction(
    () => [...document.images].every((img) => img.complete && img.naturalWidth > 0),
    null,
    { timeout: 30000 },
  );
  await page.evaluate(() => document.fonts.ready);
}

/** Lê `--nome valor` e `--flag` de process.argv. */
export function parseArgs(argv = process.argv.slice(2)) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) {
      args._.push(a);
    } else if (argv[i + 1] === undefined || argv[i + 1].startsWith("--")) {
      args[a.slice(2)] = true;
    } else {
      args[a.slice(2)] = argv[++i];
    }
  }
  return args;
}

export function fail(message) {
  console.error(`\n✗ ${message}`);
  process.exit(1);
}

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}
