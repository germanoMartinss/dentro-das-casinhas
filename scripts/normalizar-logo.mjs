#!/usr/bin/env node
/**
 * Padroniza um logo de convênio para a seção "Convênios".
 *
 * Recorta as margens vazias do arquivo original (transparentes ou brancas) e
 * centraliza o logo numa tela transparente de tamanho fixo, igual para todos
 * os convênios. Assim o componente usa uma única regra de CSS, e o tamanho
 * visual de cada marca fica definido no próprio arquivo.
 *
 * Uso:
 *   node scripts/normalizar-logo.mjs <entrada> <saída.png> --largura <px>
 *   node scripts/normalizar-logo.mjs <entrada> <saída.png> --altura <px>
 *
 *   --largura / --altura  tamanho do logo na tela, em px CSS (use um dos dois)
 *   --dx / --dy           deslocamento opcional a partir do centro, em px CSS
 *
 * Exemplo:
 *   node scripts/normalizar-logo.mjs ~/Downloads/unimed.png public/images/convenios/unimed.png --altura 34
 */
import sharp from "sharp";

// Tamanho da tela em px CSS. Precisa bater com LOGO_BOX em src/components/Convenios.tsx.
export const LOGO_BOX = { width: 160, height: 72 };
const SCALE = 2; // arquivo em 2x para telas de alta densidade

function parseArgs(argv) {
  const [input, output, ...rest] = argv;
  const opts = {};
  for (let i = 0; i < rest.length; i += 2) opts[rest[i].replace(/^--/, "")] = Number(rest[i + 1]);
  if (!input || !output || (!opts.largura && !opts.altura)) {
    console.error("Uso: node scripts/normalizar-logo.mjs <entrada> <saída.png> --largura <px> | --altura <px> [--dx px] [--dy px]");
    process.exit(1);
  }
  return { input, output, ...opts };
}

/** Caixa do conteúdo: pelo canal alfa quando houver transparência; senão, recorta o fundo branco. */
export async function contentBox(input) {
  const meta = await sharp(input).metadata();
  if (meta.hasAlpha) {
    const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    let x0 = info.width, y0 = info.height, x1 = -1, y1 = -1;
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        if (data[(y * info.width + x) * 4 + 3] > 8) {
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
      }
    }
    return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
  }
  const { info } = await sharp(input).trim({ threshold: 10 }).toBuffer({ resolveWithObject: true });
  return { left: -info.trimOffsetLeft, top: -info.trimOffsetTop, width: info.width, height: info.height };
}

export async function normalizeLogo({ input, output, largura, altura, dx = 0, dy = 0 }) {
  const box = await contentBox(input);
  const ratio = box.width / box.height;
  const cssWidth = largura ?? altura * ratio;
  const w = Math.round(cssWidth * SCALE);
  const h = Math.round((cssWidth / ratio) * SCALE);
  const canvasW = LOGO_BOX.width * SCALE;
  const canvasH = LOGO_BOX.height * SCALE;
  if (w > canvasW || h > canvasH) {
    throw new Error(`${input}: ${w / SCALE}x${h / SCALE}px não cabe na tela de ${LOGO_BOX.width}x${LOGO_BOX.height}px`);
  }

  const logo = await sharp(input).extract(box).resize(w, h, { kernel: "lanczos3" }).png().toBuffer();
  await sharp({ create: { width: canvasW, height: canvasH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{
      input: logo,
      left: Math.round((canvasW - w) / 2 + dx * SCALE),
      top: Math.round((canvasH - h) / 2 + dy * SCALE),
    }])
    .png({ compressionLevel: 9 })
    .toFile(output);
  return { output, cssSize: `${(w / SCALE).toFixed(1)}x${(h / SCALE).toFixed(1)}` };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await normalizeLogo(parseArgs(process.argv.slice(2)));
  console.log(`${result.output}: logo com ${result.cssSize}px numa tela de ${LOGO_BOX.width}x${LOGO_BOX.height}px`);
}
