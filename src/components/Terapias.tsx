import type { ReactNode } from "react";
import { THERAPIES } from "@/data/terapias";
import type { BrandColor, TherapyIcon } from "@/types";

const ICONS: Record<TherapyIcon, ReactNode> = {
  puzzle: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 3h4a1 1 0 0 1 1 1v2a2 2 0 1 0 0 4v2a1 1 0 0 1-1 1h-2a2 2 0 1 1-4 0H5a1 1 0 0 1-1-1v-4a2 2 0 1 0 0-4V3a1 1 0 0 1 1-1h4v1z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  speech: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 5h16v11H9l-4 4v-4H4V5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  hand: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 12V4.5a1.5 1.5 0 0 1 3 0V11m3 1V6.5a1.5 1.5 0 0 1 3 0V13m-9-1v9m9-8v3c0 3-2 6-6 6h-1c-3 0-5-1.5-6-4l-2-4.5c-.5-1 .3-2 1.3-1.7L7 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  heart: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20s-7-4.4-9.3-9C1.2 8 2.5 5 6 5c2 0 3.5 1.2 4.3 2.6C11 6.2 12.5 5 14.5 5c3.5 0 4.8 3 3.3 6-2.3 4.6-9.3 9-9.3 9z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  footprints: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <ellipse cx="8" cy="8" rx="3" ry="4" stroke="currentColor" strokeWidth="1.6" />
      <ellipse cx="16" cy="15" rx="3" ry="4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  book: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 5c2-1 5-1 8 0v14c-3-1-6-1-8 0V5zm16 0c-2-1-5-1-8 0v14c3-1 6-1 8 0V5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

// Ícone escuro sobre as cores claras e branco só sobre o terracota, para o
// desenho manter contraste de 3:1 com o fundo (WCAG 1.4.11).
const ICON_STYLE: Record<BrandColor, string> = {
  slate: "bg-slate text-ink",
  mustard: "bg-mustard text-ink",
  sage: "bg-sage text-ink",
  terracotta: "bg-terracotta text-white",
};

export default function Terapias() {
  return (
    <section id="terapias" aria-labelledby="terapias-titulo" className="text-center bg-sand-deep px-[6vw] py-21">
      <p className="font-hand text-[32px] text-terracotta-deep font-bold mb-1">
        como cuidamos
      </p>
      <h2
        id="terapias-titulo"
        className="font-heading font-extrabold text-[clamp(28px,4vw,40px)] mb-12 text-ink"
      >
        Terapias &amp; Serviços
      </h2>

      <div className="grid gap-6 max-w-[1080px] mx-auto grid-cols-[repeat(auto-fit,minmax(230px,1fr))]">
        {THERAPIES.map((therapy) => (
          <div
            key={therapy.title}
            className="bg-white rounded-3xl p-8 px-6 text-left shadow-card"
          >
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-[18px] ${ICON_STYLE[therapy.color]}`}
            >
              {ICONS[therapy.icon]}
            </div>
            <h3 className="font-heading text-[19px] font-bold mb-2 text-ink">
              {therapy.title}
            </h3>
            <p className="text-[15px] leading-[1.55] text-ink-subtle">
              {therapy.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
