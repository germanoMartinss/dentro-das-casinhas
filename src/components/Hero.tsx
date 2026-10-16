import Image from "next/image";
import Bunting from "@/components/Bunting";
import { GOOGLE_FORM_URL } from "@/lib/site";

export default function Hero() {
  return (
    <section aria-labelledby="inicio-titulo">
      {/* Faixa decorativa: o logo repete o do cabeçalho, por isso alt="" */}
      <div className="bg-terracotta-band">
        <Bunting />
        <div className="flex justify-center px-[6vw] pt-8 pb-9">
          <Image
            src="/images/logo-white.png"
            alt=""
            width={270}
            height={175}
            className="h-[175px] w-auto"
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
            <span className="text-terracotta">autonomia</span>, dentro de
            casa e além dela.
          </h1>
          <p className="text-[19px] leading-relaxed text-ink-muted max-w-[560px] mx-auto mb-8">
            A Dentro Das Casinhas é uma clínica multidisciplinar
            especializada em intervenção para crianças neurodivergentes, com
            terapias baseadas em evidências científicas — feitas com ética,
            empatia e acolhimento.
          </p>
          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-terracotta text-white font-extrabold text-[17px] px-9 py-4 rounded-full shadow-cta hover:bg-terracotta-hover transition-colors"
          >
            Agende uma visita
          </a>
        </div>
      </div>
    </section>
  );
}
