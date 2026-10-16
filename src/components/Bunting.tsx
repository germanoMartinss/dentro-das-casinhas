import { useId } from "react";
import type { BrandColor } from "@/types";

const FLAG_COLORS: BrandColor[] = ["slate", "mustard", "sage", "terracotta"];

const FILL: Record<BrandColor, string> = {
  slate: "fill-slate",
  mustard: "fill-mustard",
  sage: "fill-sage",
  terracotta: "fill-terracotta",
};

// Cada bandeirinha tem 34x58px com a base em semicírculo e 3px de margem de
// cada lado (40px por bandeirinha, 160px por ciclo de 4 cores).
const FLAG_WIDTH = 34;
const FLAG_HEIGHT = 58;
const FLAG_GAP = 3;
const SLOT = FLAG_WIDTH + FLAG_GAP * 2;
const RADIUS = FLAG_WIDTH / 2;
const FLAG_PATH = `M0 0H${FLAG_WIDTH}V${FLAG_HEIGHT - RADIUS}A${RADIUS} ${RADIUS} 0 0 1 0 ${FLAG_HEIGHT - RADIUS}Z`;

/**
 * Faixa decorativa de bandeirinhas, desenhada como um padrão SVG repetido
 * (antes eram 100 divs por faixa).
 *
 * O padrão começa no centro da faixa (x="50%") com a 3ª cor (sage), que é a
 * mesma fase da fileira original de 100 bandeirinhas centralizada na tela.
 */
export default function Bunting() {
  const patternId = useId();
  const order = [...FLAG_COLORS.slice(2), ...FLAG_COLORS.slice(0, 2)];

  return (
    <svg
      aria-hidden="true"
      className="block w-full"
      height={FLAG_HEIGHT}
    >
      <defs>
        <pattern
          id={patternId}
          x="50%"
          width={SLOT * order.length}
          height={FLAG_HEIGHT}
          patternUnits="userSpaceOnUse"
        >
          {order.map((color, i) => (
            <path
              key={color}
              d={FLAG_PATH}
              transform={`translate(${i * SLOT + FLAG_GAP} 0)`}
              className={FILL[color]}
            />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height={FLAG_HEIGHT} fill={`url(#${patternId})`} />
    </svg>
  );
}
