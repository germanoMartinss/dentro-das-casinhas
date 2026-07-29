"use client";

import { useState } from "react";
import Image from "next/image";

const PHOTOS = Array.from({ length: 20 }, (_, i) => `/images/casinha/${i + 1}.jpg`);

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

const TAPE_COLORS = ["#8993A6", "#E8C15F", "#A9C6B5", "#D9713C"];

export default function Galeria() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section
      id="casinha"
      className="relative text-center bg-cream overflow-hidden px-[6vw] py-24"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(61,58,52,0.035) 0 1.5px, transparent 1.5px 30px), repeating-linear-gradient(90deg, rgba(61,58,52,0.035) 0 1.5px, transparent 1.5px 58px)",
      }}
    >
      <p className="font-hand text-[32px] text-terracotta font-bold mb-1">
        bem-vindo à nossa casinha
      </p>
      <h2 className="font-heading font-extrabold text-[clamp(28px,4vw,40px)] mb-16 text-[#3D3A34]">
        Conheça a Casinha
      </h2>

      <div className="flex flex-wrap justify-center gap-x-3 gap-y-14 max-w-[1200px] mx-auto">
        {PHOTOS.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setSelected(i)}
            aria-label={`Ampliar foto ${i + 1} da Casinha`}
            className={`relative bg-white p-3 pb-7 w-[42vw] sm:w-[190px] shadow-[0_8px_18px_rgba(61,58,52,0.2)] transition-transform duration-300 hover:rotate-0 hover:scale-110 hover:z-10 cursor-pointer ${ROTATIONS[i % ROTATIONS.length]}`}
          >
            <span
              className="absolute -top-3 left-1/2 -translate-x-1/2 -rotate-3 w-10 h-5 rounded-sm opacity-80"
              style={{ background: TAPE_COLORS[i % TAPE_COLORS.length] }}
            />
            <Image
              src={src}
              alt={`Dentro da Casinha - foto ${i + 1}`}
              width={400}
              height={400}
              sizes="(max-width: 640px) 42vw, 190px"
              className="w-full aspect-square object-cover"
            />
          </button>
        ))}
      </div>

      {selected !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#3D3A34]/90 px-[6vw] py-10"
          onClick={() => setSelected(null)}
        >
          <button
            type="button"
            onClick={() => setSelected(null)}
            aria-label="Fechar"
            className="absolute top-6 right-6 text-white text-4xl leading-none font-bold hover:text-terracotta transition-colors"
          >
            &times;
          </button>
          <Image
            src={PHOTOS[selected]}
            alt={`Dentro da Casinha - foto ${selected + 1}`}
            width={1200}
            height={1200}
            className="max-h-[85vh] max-w-full w-auto h-auto object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
