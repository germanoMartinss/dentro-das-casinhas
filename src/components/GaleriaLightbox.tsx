"use client";

import { useState, type MouseEvent, type ReactNode } from "react";
import Image from "next/image";
import type { GalleryPhoto } from "@/types";

type Props = {
  photos: GalleryPhoto[];
  className?: string;
  /** Miniaturas renderizadas no servidor; cada uma marcada com data-photo-index. */
  children: ReactNode;
};

/**
 * Grade da galeria + lightbox. As miniaturas chegam prontas do servidor e o
 * clique é capturado por delegação: só o estado do lightbox vive no cliente.
 */
export default function GaleriaLightbox({ photos, className, children }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  function handleGridClick(e: MouseEvent<HTMLDivElement>) {
    const trigger = (e.target as HTMLElement).closest<HTMLElement>("[data-photo-index]");
    if (trigger) setSelected(Number(trigger.dataset.photoIndex));
  }

  return (
    <div className={className} onClick={handleGridClick}>
      {children}

      {selected !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 px-[6vw] py-10"
          onClick={(e) => {
            e.stopPropagation();
            setSelected(null);
          }}
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
            src={photos[selected].src}
            alt={photos[selected].alt}
            width={1200}
            height={1200}
            className="max-h-[85vh] max-w-full w-auto h-auto object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
