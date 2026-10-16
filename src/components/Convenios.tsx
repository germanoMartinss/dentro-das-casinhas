import Image from "next/image";
import Bunting from "@/components/Bunting";
import { INSURANCE_PLANS } from "@/data/convenios";

// Tela padrão dos logos em px CSS (o arquivo é 2x). Igual a LOGO_BOX em
// scripts/normalizar-logo.mjs.
const LOGO_BOX = { width: 160, height: 72 };

export default function Convenios() {
  return (
    <section
      id="convenios"
      aria-labelledby="convenios-titulo"
      className="relative text-center bg-terracotta-band bg-grid bg-grid-light pb-21"
    >
      <Bunting />

      <div className="px-[6vw] pt-10">
        <p className="text-cream text-xl font-bold mb-1">A Casinha atende os</p>
        <h2
          id="convenios-titulo"
          className="font-heading font-extrabold text-[clamp(28px,4vw,40px)] text-white mb-3 tracking-wide"
        >
          CONVÊNIOS:
        </h2>
        <div aria-hidden="true" className="w-20 h-[3px] bg-white/40 mx-auto mb-11 rounded-full" />

        <ul className="grid gap-[18px] max-w-[900px] mx-auto grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
          {INSURANCE_PLANS.map((plan) => (
            <li
              key={plan.name}
              className="bg-white rounded-2xl px-5 py-6 flex items-center justify-center min-h-[110px] overflow-hidden shadow-logo"
            >
              <Image
                src={plan.logo}
                alt={`Logo ${plan.name}`}
                width={LOGO_BOX.width}
                height={LOGO_BOX.height}
                className="w-[160px] h-[72px] max-w-none shrink-0 object-contain"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
