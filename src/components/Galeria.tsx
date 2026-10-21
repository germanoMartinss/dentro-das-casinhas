import type { CSSProperties } from "react";
import Image from "next/image";
import GaleriaLightbox from "@/components/GaleriaLightbox";
import PreCadastroButton from "@/components/PreCadastroButton";
import { GALLERY_PHOTOS } from "@/data/fotos";
import type { BrandColor } from "@/types";

const ROTATIONS = [
  "rotate-2",
  "-rotate-3",
  "rotate-3",
  "-rotate-2",
  "rotate-1",
  "-rotate-1",
  "rotate-3",
  "-rotate-3",
  "rotate-2",
  "-rotate-1",
];

const TAPE_COLORS: BrandColor[] = ["slate", "mustard", "sage", "terracotta"];

const TAPE_BG: Record<BrandColor, string> = {
  slate: "bg-slate",
  mustard: "bg-mustard",
  sage: "bg-sage",
  terracotta: "bg-terracotta",
};

export default function Galeria() {
  return (
    <section
      id="casinha"
      aria-labelledby="casinha-titulo"
      className="relative text-center bg-cream bg-grid overflow-hidden px-[6vw] py-24"
    >
      <p className="font-hand text-[32px] text-terracotta-deep font-bold mb-1">
        bem-vindo à nossa casinha
      </p>
      <h2
        id="casinha-titulo"
        className="font-heading font-extrabold text-[clamp(28px,4vw,40px)] mb-16 text-ink"
      >
        Conheça a Casinha
      </h2>

      <GaleriaLightbox
        photos={GALLERY_PHOTOS}
        className="flex flex-wrap justify-center gap-x-3 gap-y-14 max-w-[1200px] mx-auto"
      >
        {GALLERY_PHOTOS.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            data-photo-index={i}
            data-reveal="drop"
            style={{ "--reveal-i": i % 6 } as CSSProperties}
            aria-label={`Ampliar foto: ${photo.alt}`}
            className={`relative bg-white p-3 pb-7 w-[42vw] sm:w-[190px] shadow-polaroid transition-[translate,scale,rotate,box-shadow] duration-300 motion-reduce:transition-none hover:rotate-0 hover:-translate-y-2 hover:scale-105 hover:z-10 hover:shadow-polaroid-lifted focus-visible:rotate-0 focus-visible:-translate-y-2 focus-visible:scale-105 focus-visible:z-10 focus-visible:shadow-polaroid-lifted cursor-pointer ${ROTATIONS[i % ROTATIONS.length]}`}
          >
            <span
              aria-hidden="true"
              className={`absolute -top-3 left-1/2 -translate-x-1/2 -rotate-3 w-10 h-5 rounded-sm opacity-80 ${TAPE_BG[TAPE_COLORS[i % TAPE_COLORS.length]]}`}
            />
            <Image
              src={photo.src}
              alt={photo.alt}
              width={400}
              height={400}
              sizes="(max-width: 640px) 42vw, 190px"
              className="w-full aspect-square object-cover"
            />
          </button>
        ))}
      </GaleriaLightbox>

      <div
        data-reveal
        className="relative max-w-[560px] mx-auto mt-20 bg-white rounded-3xl px-6 py-8 sm:px-10 shadow-card-lifted"
      >
        <span
          aria-hidden="true"
          className="absolute -top-3 left-1/2 -translate-x-1/2 rotate-2 w-14 h-6 rounded-sm opacity-80 bg-sage"
        />
        <p className="font-heading font-extrabold text-[clamp(22px,3vw,28px)] leading-tight text-ink mb-2">
          Bem-vindo à Casinha
        </p>
        <p className="text-ink-soft mb-6">Primeiro passo para o seu filho fazer parte da Casinha.</p>
        <PreCadastroButton className="px-8 py-3.5 text-[17px] shadow-cta" />
      </div>
    </section>
  );
}
