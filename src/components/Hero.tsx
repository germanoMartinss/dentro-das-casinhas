import Image from "next/image";
import Bunting from "@/components/Bunting";
import CountUp from "@/components/CountUp";
import CtaLink from "@/components/CtaLink";
import { HIGHLIGHTS } from "@/data/destaques";
import { HERO_PHOTO } from "@/data/fotos";

export default function Hero() {
  return (
    <section aria-labelledby="inicio-titulo" className="relative bg-cream bg-grid">
      <Bunting />

      <div className="max-w-[1180px] mx-auto px-[6vw] lg:px-10 pt-12 pb-14 lg:pt-16 lg:pb-20 grid gap-12 lg:gap-14 lg:grid-cols-[1.05fr_0.95fr] items-center">
        <div className="text-center lg:text-left">
          <h1
            id="inicio-titulo"
            className="font-heading font-extrabold text-[clamp(34px,4.6vw,56px)] leading-[1.12] mb-5 text-ink"
          >
            Cuidado que constrói{" "}
            <span className="text-terracotta-deep">autonomia</span>, dentro de
            casa e além dela.
          </h1>
          <p className="text-[19px] leading-relaxed text-ink-muted max-w-[560px] mx-auto lg:mx-0 mb-8">
            A Dentro Das Casinhas é uma clínica multidisciplinar
            especializada em intervenção para crianças neurodivergentes, com
            terapias baseadas em evidências científicas — feitas com ética,
            empatia e acolhimento.
          </p>
          <CtaLink className="text-[17px] px-9 py-4 shadow-cta" />
        </div>

        {/* Foto em moldura polaroid, com a mesma "fita adesiva" da galeria */}
        <figure className="relative justify-self-center w-full max-w-[480px] bg-white p-3 pb-11 sm:p-4 sm:pb-12 shadow-polaroid rotate-2">
          <span
            aria-hidden="true"
            className="absolute -top-3.5 left-1/2 -translate-x-1/2 -rotate-3 w-24 h-7 rounded-sm opacity-85 bg-mustard"
          />
          <Image
            src={HERO_PHOTO.src}
            alt={`Espaço da Casinha: ${HERO_PHOTO.alt.charAt(0).toLowerCase()}${HERO_PHOTO.alt.slice(1)}`}
            width={1440}
            height={960}
            sizes="(min-width: 1180px) 448px, (min-width: 1024px) 38vw, (min-width: 560px) 448px, 82vw"
            preload
            className="w-full h-auto aspect-[3/2] object-cover"
          />
          <figcaption className="absolute bottom-2 sm:bottom-3 inset-x-0 text-center font-hand text-2xl font-bold text-ink-muted">
            nosso salão de atividades
          </figcaption>
        </figure>
      </div>

      {/* Faixa de confiança: os números vêm dos dados (src/data/destaques.ts) */}
      <div className="px-[6vw] pb-14 lg:pb-16">
        <ul className="max-w-[900px] mx-auto grid grid-cols-3 bg-white rounded-3xl shadow-card divide-x divide-ink/10">
          {HIGHLIGHTS.map((item) => (
            <li key={item.label} className="px-2 py-5 sm:py-6 text-center">
              <span className="block font-heading font-extrabold text-[clamp(32px,5vw,48px)] leading-none text-terracotta-deep">
                <CountUp value={item.value} />
              </span>
              <span className="block mt-2 text-sm sm:text-base font-bold text-ink-soft">
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
