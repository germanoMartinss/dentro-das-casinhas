import Image from "next/image";
import Bunting from "@/components/Bunting";
import CtaLink from "@/components/CtaLink";
import { logoWidthFor } from "@/lib/site";

export default function Hero() {
  return (
    <section aria-labelledby="inicio-titulo">
      {/*
        Faixa decorativa: o logo repete o do cabeçalho, por isso alt="".
        Sem `preload`: o LCP é o parágrafo do hero (texto), e pré-carregar o
        logo disputa banda com as fontes (medido: LCP +150ms em 4G lento).
      */}
      <div className="bg-terracotta-band">
        <Bunting />
        <div className="flex justify-center px-[6vw] pt-8 pb-9">
          <Image
            src="/images/logo-white.png"
            alt=""
            width={logoWidthFor(175)}
            height={175}
            className="h-[175px] w-auto"
            loading="eager"
          />
        </div>
      </div>

      <div className="relative text-center bg-cream bg-grid overflow-hidden px-[6vw] pt-16 pb-22">
        <div className="relative max-w-[720px] mx-auto">
          <h1
            id="inicio-titulo"
            className="font-heading font-extrabold text-[clamp(32px,5vw,52px)] leading-[1.15] mb-[18px] text-ink"
          >
            Cuidado que constrói{" "}
            <span className="text-terracotta-deep">autonomia</span>, dentro de
            casa e além dela.
          </h1>
          <p className="text-[19px] leading-relaxed text-ink-muted max-w-[560px] mx-auto mb-8">
            A Dentro Das Casinhas é uma clínica multidisciplinar
            especializada em intervenção para crianças neurodivergentes, com
            terapias baseadas em evidências científicas — feitas com ética,
            empatia e acolhimento.
          </p>
          <CtaLink className="text-[17px] px-9 py-4 shadow-cta" />
        </div>
      </div>
    </section>
  );
}
