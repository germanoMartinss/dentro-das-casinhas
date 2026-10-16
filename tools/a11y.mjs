#!/usr/bin/env node
/**
 * Acessibilidade: roda o axe-core na página e testa o comportamento por
 * teclado (skip link, percurso completo de Tab, lightbox, FAQ, faixa de
 * convênios, menu mobile) e movimento reduzido.
 *
 *   npm run test:a11y
 *
 * Opções:
 *   --ignorar regra1,regra2   regras do axe que não reprovam o teste
 *
 * Sai com código 1 se houver violação do axe não ignorada ou se alguma
 * verificação de comportamento falhar.
 */
import fs from "node:fs";
import { createRequire } from "node:module";
import { BASE_URL, launchBrowser, parseArgs, requireServer } from "./lib.mjs";

const args = parseArgs();
const ignored = new Set(String(args.ignorar ?? "").split(",").filter(Boolean));
const axeSource = fs.readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");

let failures = 0;
function check(label, ok, detail = "") {
  console.log(`${ok ? "✓" : "✗"} ${label}${detail ? ` (${detail})` : ""}`);
  if (!ok) failures++;
}
const focused = (page) =>
  page.evaluate(() => {
    const el = document.activeElement;
    return { tag: el.tagName.toLowerCase(), id: el.id, label: el.getAttribute("aria-label") ?? el.textContent.trim() };
  });

await requireServer();
const browser = await launchBrowser();

// --- axe-core e estrutura
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.addScriptTag({ content: axeSource });
  const violations = await page.evaluate(async () =>
    // `axe` é global na página: foi injetado pelo addScriptTag acima
    (await axe.run(document, { resultTypes: ["violations"] })).violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.length,
      help: v.help,
    })),
  );
  console.log("axe-core:");
  if (!violations.length) console.log("  nenhuma violação");
  for (const v of violations) {
    const isIgnored = ignored.has(v.id);
    console.log(`  ${isIgnored ? "~" : "✗"} ${v.id} [${v.impact}] em ${v.nodes} elemento(s): ${v.help}${isIgnored ? " (ignorada)" : ""}`);
    if (!isIgnored) failures++;
  }

  const structure = await page.evaluate(() => ({
    h1: document.querySelectorAll("h1").length,
    lang: document.documentElement.lang,
    imgsSemAlt: [...document.images].filter((i) => !i.hasAttribute("alt")).length,
    altsRepetidos: (() => {
      const alts = [...document.images].map((i) => i.alt).filter(Boolean);
      return alts.length - new Set(alts).size;
    })(),
    navsSemRotulo: [...document.querySelectorAll("nav")].filter((n) => !n.getAttribute("aria-label")).length,
  }));
  console.log("\nEstrutura:");
  check("um único h1", structure.h1 === 1, `${structure.h1}`);
  check('lang="pt-BR"', structure.lang === "pt-BR", structure.lang);
  check("todas as imagens com alt", structure.imgsSemAlt === 0, `${structure.imgsSemAlt} sem alt`);
  check("alts não repetidos", structure.altsRepetidos === 0, `${structure.altsRepetidos} repetido(s)`);
  check("todo <nav> com aria-label", structure.navsSemRotulo === 0);

  console.log("\nTeclado:");
  await page.keyboard.press("Tab");
  check("1º Tab foca o skip link", (await focused(page)).label === "Pular para o conteúdo");
  await page.keyboard.press("Enter");
  check("skip link leva o foco ao <main>", (await focused(page)).id === "conteudo");

  // lightbox
  await page.focus('[data-photo-index="2"]');
  await page.keyboard.press("Enter");
  const dialog = page.locator('[role="dialog"][aria-modal="true"]');
  check("Enter na foto abre o diálogo modal", (await dialog.count()) === 1);
  check("foco vai para o botão Fechar", (await focused(page)).label === "Fechar");
  check("rolagem do fundo travada", (await page.evaluate(() => document.body.style.overflow)) === "hidden");
  await page.keyboard.press("ArrowRight");
  check("→ avança para a foto 4", (await dialog.getAttribute("aria-label")).startsWith("Foto 4 de"));
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  check("← volta para a foto 2", (await dialog.getAttribute("aria-label")).startsWith("Foto 2 de"));
  const buttons = await dialog.locator("button").count();
  for (let i = 0; i < buttons; i++) await page.keyboard.press("Tab");
  check("Tab fica preso no diálogo", (await focused(page)).label === "Fechar");
  await page.keyboard.press("Escape");
  check("Esc fecha o diálogo", (await dialog.count()) === 0);
  check("foco volta à miniatura que abriu", (await focused(page)).label.startsWith("Ampliar foto"));
  check("rolagem do fundo liberada", (await page.evaluate(() => document.body.style.overflow)) === "");

  // FAQ
  const faqButton = page.locator("#duvidas button[aria-controls]").first();
  if (await faqButton.count()) {
    console.log("\nFAQ:");
    const panelId = await faqButton.getAttribute("aria-controls");
    check("pergunta começa fechada", (await faqButton.getAttribute("aria-expanded")) === "false");
    await faqButton.focus();
    await page.keyboard.press("Enter");
    check(
      "Enter abre a resposta (aria-expanded e painel visível)",
      (await faqButton.getAttribute("aria-expanded")) === "true" && (await page.locator(`[id="${panelId}"]`).isVisible()),
    );
    await page.keyboard.press("Space");
    check("Espaço fecha a resposta", (await faqButton.getAttribute("aria-expanded")) === "false");
  }

  // faixa de convênios
  const marquee = page.locator(".marquee");
  if (await marquee.count()) {
    console.log("\nFaixa de convênios:");
    const state = () =>
      page.evaluate(() => getComputedStyle(document.querySelector(".marquee-track")).animationPlayState);
    check("rola sozinha", (await state()) === "running");
    await page.locator(".marquee-toggle").focus();
    check("pausa com o foco", (await state()) === "paused");
    await page.keyboard.press("Enter");
    await page.locator("h1").focus();
    check(
      "botão mantém pausada sem foco (aria-pressed=true)",
      (await state()) === "paused" && (await page.locator(".marquee-toggle").getAttribute("aria-pressed")) === "true",
    );
    check(
      "cópia do loop oculta para leitores de tela",
      (await page.locator(".marquee-copy[aria-hidden=true]").count()) === 1,
    );
  }

  await page.close();
}

// --- percurso completo de Tab: todo foco cai em algo visível, com anel de foco e fora de aria-hidden
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  // rolagem instantânea para medir a posição logo após cada Tab
  await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
  console.log("\nPercurso de Tab:");
  const stops = [];
  for (let i = 0; i < 200; i++) {
    await page.keyboard.press("Tab");
    await page.waitForTimeout(50); // dá tempo aos ajustes de foco da página (ex.: iframe do mapa)
    const stop = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null; // chegou ao fim do documento
      const r = el.getBoundingClientRect();
      return {
        name: `${el.tagName.toLowerCase()} "${(el.getAttribute("aria-label") ?? el.getAttribute("title") ?? el.textContent).trim().replace(/\s+/g, " ").slice(0, 30)}"`,
        visible: r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight,
        hidden: !!el.closest("[aria-hidden=true]"),
        ring: el.tagName === "IFRAME" || (el.matches(":focus-visible") && getComputedStyle(el).outlineStyle !== "none"),
      };
    });
    if (!stop) break;
    stops.push(stop);
  }
  const badStops = stops.filter((s) => !s.visible || s.hidden || !s.ring);
  check(
    `${stops.length} paradas de Tab, todas visíveis, com anel de foco e fora de aria-hidden`,
    badStops.length === 0,
    badStops.map((s) => `${s.name}${s.visible ? "" : " invisível"}${s.hidden ? " aria-hidden" : ""}${s.ring ? "" : " sem anel"}`).join("; "),
  );
  await page.close();
}

// --- menu mobile
{
  const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  const toggle = page.locator('button[aria-controls="menu-mobile"]');
  const menu = page.locator("#menu-mobile");
  console.log("\nMenu mobile:");
  check("começa fechado", (await toggle.getAttribute("aria-expanded")) === "false" && !(await menu.isVisible()));
  await toggle.click();
  check(
    "abre com aria-expanded e rótulo 'Fechar menu'",
    (await toggle.getAttribute("aria-expanded")) === "true" && (await toggle.getAttribute("aria-label")) === "Fechar menu" && (await menu.isVisible()),
  );
  await page.keyboard.press("Escape");
  check("Esc fecha e devolve o foco ao botão", !(await menu.isVisible()) && (await focused(page)).label === "Abrir menu");
  await toggle.click();
  await page.mouse.click(200, 700);
  check("clique fora fecha", !(await menu.isVisible()));
  await page.close();
}

// --- movimento reduzido
{
  console.log("\nMovimento reduzido:");
  for (const reducedMotion of ["reduce", "no-preference"]) {
    const context = await browser.newContext({ reducedMotion });
    const page = await context.newPage();
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    const r = await page.evaluate(() => ({
      scroll: getComputedStyle(document.documentElement).scrollBehavior,
      transition: getComputedStyle(document.querySelector("[data-photo-index]")).transitionProperty,
    }));
    if (reducedMotion === "reduce") {
      check("reduce: sem rolagem suave e sem transição nas polaroides", r.scroll === "auto" && r.transition === "none", `${r.scroll}, ${r.transition}`);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);
      const anim = await page.evaluate(() => ({
        hidden: document.querySelectorAll(".reveal-pending").length,
        marquee: document.querySelector(".marquee-track") ? getComputedStyle(document.querySelector(".marquee-track")).animationName : "none",
        bunting: getComputedStyle(document.querySelector(".bunting-flag")).animationName,
      }));
      check("reduce: nada escondido esperando animação", anim.hidden === 0, `${anim.hidden}`);
      check("reduce: faixa de convênios e toldo parados", anim.marquee === "none" && anim.bunting === "none", `${anim.marquee}, ${anim.bunting}`);
    } else {
      check("sem preferência: rolagem suave ativa", r.scroll === "smooth", r.scroll);
    }
    await context.close();
  }
}

await browser.close();
console.log(failures ? `\n✗ ${failures} problema(s)` : "\n✓ tudo certo");
process.exit(failures ? 1 : 0);
