import type { ReactNode } from "react";
import { STEPS } from "@/data/como-funciona";
import type { BrandColor, StepIcon } from "@/types";

const ICONS: Record<StepIcon, ReactNode> = {
  chat: (
    <path d="M4 5h16v11H9l-4 4v-4H4V5zm4 4.5h8M8 12.5h5" />
  ),
  welcome: (
    <path d="M12 20s-7-4.4-9.3-9C1.2 8 2.5 5 6 5c2 0 3.5 1.2 4.3 2.6C11 6.2 12.5 5 14.5 5c3.5 0 4.8 3 3.3 6-2.3 4.6-5.8 9-5.8 9zM9 12h6M12 9v6" />
  ),
  plan: (
    <path d="M7 3h10v18H7zM10 3v2h4V3M10 10h4M10 13.5h4M10 17h2" />
  ),
  family: (
    <path d="M8 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm8 2a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM3.5 20v-3.5A4.5 4.5 0 0 1 8 12a4.5 4.5 0 0 1 4.5 4.5V20M13 20v-2.5a3 3 0 0 1 6 0V20" />
  ),
};

const ICON_STYLE: Record<BrandColor, string> = {
  slate: "bg-slate text-ink",
  mustard: "bg-mustard text-ink",
  sage: "bg-sage text-ink",
  terracotta: "bg-terracotta text-white",
};

export default function ComoFunciona() {
  return (
    <section
      id="como-funciona"
      aria-labelledby="como-funciona-titulo"
      data-reveal
      className="text-center bg-cream px-[6vw] py-21"
    >
      <p className="font-hand text-[32px] text-terracotta-deep font-bold mb-1">
        passo a passo
      </p>
      <h2
        id="como-funciona-titulo"
        className="font-heading font-extrabold text-[clamp(28px,4vw,40px)] mb-12 text-ink"
      >
        Como funciona
      </h2>

      <ol className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-[1080px] mx-auto">
        {/* linha tracejada ligando os passos (só no desktop) */}
        <span
          aria-hidden="true"
          className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] border-t-2 border-dashed border-ink/20"
        />
        {STEPS.map((step, i) => (
          <li key={step.title} className="relative flex flex-col items-center">
            <span
              className={`relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-card ${ICON_STYLE[step.color]}`}
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {ICONS[step.icon]}
              </svg>
              <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-ink text-white text-sm font-extrabold flex items-center justify-center">
                {i + 1}
              </span>
            </span>
            <h3 className="font-heading text-[19px] font-bold mt-5 mb-2 text-ink">
              {step.title}
            </h3>
            <p className="text-[15px] leading-[1.6] text-ink-subtle max-w-[250px]">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
