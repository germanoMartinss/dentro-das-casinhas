import Image from "next/image";
import Bunting from "@/components/Bunting";
import ConveniosMarquee from "@/components/ConveniosMarquee";
import { INSURANCE_PLANS } from "@/data/convenios";

// Tela padrão dos logos em px CSS (o arquivo é 2x). Igual a LOGO_BOX em
// scripts/normalizar-logo.mjs.
const LOGO_BOX = { width: 160, height: 72 };

/** Lista de logos; a cópia (para emendar o loop) fica oculta para leitores de tela. */
function LogoList({ copy = false }: { copy?: boolean }) {
  return (
    <ul aria-hidden={copy || undefined} className={`flex shrink-0 ${copy ? "marquee-copy" : ""}`}>
      {INSURANCE_PLANS.map((plan) => (
        <li key={plan.name} className="px-2.5 py-2">
          <div className="group/logo w-[200px] h-[110px] bg-white rounded-2xl flex items-center justify-center shadow-logo">
            <Image
              src={plan.logo}
              alt={copy ? "" : `Logo ${plan.name}`}
              width={LOGO_BOX.width}
              height={LOGO_BOX.height}
              className="w-[160px] h-[72px] max-w-none shrink-0 object-contain grayscale opacity-75 transition-[filter,opacity] duration-300 group-hover/logo:grayscale-0 group-hover/logo:opacity-100 group-focus-within/marquee:grayscale-0 group-focus-within/marquee:opacity-100"
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function Convenios() {
  return (
    <section
      id="convenios"
      aria-labelledby="convenios-titulo"
      className="relative text-center bg-terracotta-strong bg-grid bg-grid-light pb-21"
    >
      <Bunting />

      <div data-reveal className="pt-10">
        <p className="text-white text-xl font-bold mb-1">A Casinha atende os</p>
        <h2
          id="convenios-titulo"
          className="font-heading font-extrabold text-[clamp(28px,4vw,40px)] text-white mb-3 tracking-wide"
        >
          CONVÊNIOS:
        </h2>
        <div aria-hidden="true" className="w-20 h-[3px] bg-white/40 mx-auto mb-11 rounded-full" />

        {/* Faixa em loop; com "reduzir movimento" vira grade parada */}
        <ConveniosMarquee>
          <LogoList />
          <LogoList copy />
        </ConveniosMarquee>
      </div>
    </section>
  );
}
