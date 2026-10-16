#!/usr/bin/env node
/**
 * Gera as imagens de SEO a partir do logo e das fotos da Casinha:
 *
 *   src/app/opengraph-image.jpg  1200x630, JPEG < 300 KB (o WhatsApp ignora
 *   src/app/twitter-image.jpg    imagens maiores); mesma arte nos dois
 *   src/app/icon.png             512x512 (navegadores e Android)
 *   src/app/apple-icon.png       180x180 (iOS)
 *   src/app/favicon.ico          16, 32 e 48px
 *
 * O Next.js lê esses arquivos por convenção e gera as tags <meta>/<link>
 * (incluindo og:image:width/height/type). Rode de novo ao trocar o logo
 * ou a foto:  node scripts/gerar-imagens-seo.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const APP = path.join(ROOT, "src/app");
const LOGO_WHITE = path.join(ROOT, "public/images/logo-white.png");
const OG_PHOTO = path.join(ROOT, "public/images/casinha/10.jpg");

const BAND = "#c9683a"; // --color-terracotta-band
const FLAGS = ["#8993a6", "#e8c15f", "#a9c6b5", "#d9713c"]; // slate, mustard, sage, terracotta
const MAX_OG_BYTES = 300 * 1024;

/** Bandeirinhas iguais às do site (34x58, base em semicírculo, 40px por bandeirinha). */
function buntingSvg(width) {
  const flags = [];
  for (let i = 0, x = 3; x < width; i++, x += 40) {
    flags.push(`<path d="M${x} 0h34v41a17 17 0 0 1-34 0z" fill="${FLAGS[i % 4]}"/>`);
  }
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="58">${flags.join("")}</svg>`);
}

/** Recorta as margens transparentes do logo. */
async function trimmedLogo() {
  return sharp(LOGO_WHITE).trim().png().toBuffer();
}

/**
 * Só o telhado da casinha. O texto "DENTRO DAS" encosta na borda ondulada do
 * telhado, então o corte é feito onde a quantidade de tinta por linha salta
 * (a borda ondulada vai afinando e o texto começa de uma vez).
 */
async function roofOnly() {
  const logo = await trimmedLogo();
  const { data, info } = await sharp(logo).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const ink = (y) => {
    let n = 0;
    for (let x = 0; x < info.width; x++) if (data[(y * info.width + x) * 4 + 3] > 16) n++;
    return n;
  };
  let cut = Math.round(info.height / 2);
  while (cut < info.height - 1 && !(ink(cut + 1) > 2 * ink(cut))) cut++;
  const roof = await sharp(logo).extract({ left: 0, top: 0, width: info.width, height: cut + 1 }).toBuffer();
  return sharp(roof).trim().png().toBuffer();
}

async function openGraph() {
  const W = 1200, H = 630;
  const logo = await sharp(await trimmedLogo()).resize({ width: 400 }).toBuffer();
  const logoMeta = await sharp(logo).metadata();

  // foto em "polaroide", como na galeria do site
  const photo = await sharp(OG_PHOTO).resize(600, 400, { fit: "cover" }).toBuffer();
  const polaroid = await sharp({ create: { width: 632, height: 456, channels: 4, background: "#ffffff" } })
    .composite([{ input: photo, left: 16, top: 16 }])
    .png()
    .toBuffer();
  const rotated = await sharp(polaroid).rotate(3, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const rot = await sharp(rotated).metadata();
  // sombra: a silhueta da polaroide (canal alfa) atenuada e desfocada, sobre preto
  const shadowAlpha = await sharp(rotated).extractChannel(3).linear(0.3, 0).blur(10).raw().toBuffer();
  const shadow = await sharp({ create: { width: rot.width, height: rot.height, channels: 3, background: "#000" } })
    .joinChannel(shadowAlpha, { raw: { width: rot.width, height: rot.height, channels: 1 } })
    .png()
    .toBuffer();

  const top = 58 + Math.round((H - 58 - rot.height) / 2);
  const left = W - rot.width - 40;
  let quality = 84;
  let out;
  do {
    out = await sharp({ create: { width: W, height: H, channels: 3, background: BAND } })
      .composite([
        { input: buntingSvg(W), left: 0, top: 0 },
        { input: logo, left: 70, top: 58 + Math.round((H - 58 - logoMeta.height) / 2) },
        { input: shadow, left: left + 4, top: top + 10 },
        { input: rotated, left, top },
      ])
      .jpeg({ quality, mozjpeg: true, progressive: true })
      .toBuffer();
    quality -= 4;
  } while (out.length > MAX_OG_BYTES && quality > 50);
  if (out.length > MAX_OG_BYTES) throw new Error(`opengraph-image.jpg ficou com ${out.length} bytes`);

  fs.writeFileSync(path.join(APP, "opengraph-image.jpg"), out);
  fs.writeFileSync(path.join(APP, "twitter-image.jpg"), out);
  const alt = "Dentro Das Casinhas: logo da clínica e foto de um dos salões de atividades";
  fs.writeFileSync(path.join(APP, "opengraph-image.alt.txt"), alt);
  fs.writeFileSync(path.join(APP, "twitter-image.alt.txt"), alt);
  return `${W}x${H}, ${(out.length / 1024).toFixed(0)} KB, qualidade ${quality + 4}`;
}

/** Ícone quadrado: telhado branco sobre o terracota da faixa. */
async function squareIcon(size, { rounded = false } = {}) {
  const small = size <= 48;
  let source = await roofOnly();
  if (small) {
    // favicon: telhado maior e traço engrossado (dilata o canal alfa) para o
    // desenho não sumir em 16-48px; o traço final fica com ~1,2px
    const { width, height } = await sharp(source).metadata();
    const scale = (size * 0.92) / width;
    const radius = Math.max(1, Math.round(0.6 / scale));
    const pad = radius * 2;
    const padded = await sharp(source).extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
    const alpha = await sharp(padded).extractChannel(3).blur(radius).threshold(24).raw().toBuffer();
    source = await sharp({ create: { width: width + pad * 2, height: height + pad * 2, channels: 3, background: "#fff" } })
      .joinChannel(alpha, { raw: { width: width + pad * 2, height: height + pad * 2, channels: 1 } })
      .png()
      .toBuffer();
  }
  const roof = await sharp(source).resize({ width: Math.round(size * (small ? 0.92 : 0.78)) }).toBuffer();
  const meta = await sharp(roof).metadata();
  const r = rounded ? Math.round(size * 0.18) : 0;
  const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" fill="${BAND}"/></svg>`);
  return sharp(bg)
    .composite([{ input: roof, left: Math.round((size - meta.width) / 2), top: Math.round((size - meta.height) / 2) }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** .ico com imagens PNG embutidas (formato aceito por todos os navegadores atuais). */
function ico(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + 16 * pngs.length;
  const entries = pngs.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4); // planos
    e.writeUInt16LE(32, 6); // bits por pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

console.log("opengraph/twitter:", await openGraph());
fs.writeFileSync(path.join(APP, "icon.png"), await squareIcon(512, { rounded: true }));
fs.writeFileSync(path.join(APP, "apple-icon.png"), await squareIcon(180));
const favicons = await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await squareIcon(size, { rounded: true }) })));
fs.writeFileSync(path.join(APP, "favicon.ico"), ico(favicons));
console.log("icon.png 512, apple-icon.png 180, favicon.ico 16/32/48: ok");
