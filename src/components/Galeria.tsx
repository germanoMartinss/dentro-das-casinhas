import Image from "next/image";
import GaleriaLightbox from "@/components/GaleriaLightbox";
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
            aria-label={`Ampliar foto: ${photo.alt}`}
            className={`relative bg-white p-3 pb-7 w-[42vw] sm:w-[190px] shadow-polaroid transition-transform duration-300 motion-reduce:transition-none hover:rotate-0 hover:scale-110 hover:z-10 focus-visible:rotate-0 focus-visible:scale-110 focus-visible:z-10 cursor-pointer ${ROTATIONS[i % ROTATIONS.length]}`}
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
    </section>
  );
}
