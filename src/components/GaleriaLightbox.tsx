"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import type { GalleryPhoto } from "@/types";

type Props = {
  photos: GalleryPhoto[];
  className?: string;
  /** Miniaturas renderizadas no servidor; cada uma marcada com data-photo-index. */
  children: ReactNode;
};

const NAV_BUTTON =
  "absolute top-1/2 -translate-y-1/2 text-white text-5xl leading-none font-bold px-2 pb-1 hover:text-terracotta transition-colors";

/**
 * Grade da galeria + lightbox. As miniaturas chegam prontas do servidor e o
 * clique é capturado por delegação: só o estado do lightbox vive no cliente.
 *
 * Acessibilidade: diálogo modal com foco preso, Esc fecha, setas (teclado e
 * botões) navegam entre fotos, o fundo não rola e o foco volta à miniatura
 * que abriu o lightbox.
 */
export default function GaleriaLightbox({ photos, className, children }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setSelected(null);
    openerRef.current?.focus();
  }, []);

  const step = useCallback(
    (delta: number) =>
      setSelected((i) => (i === null ? i : (i + delta + photos.length) % photos.length)),
    [photos.length],
  );

  function handleGridClick(e: MouseEvent<HTMLDivElement>) {
    const trigger = (e.target as HTMLElement).closest<HTMLElement>("[data-photo-index]");
    if (!trigger) return;
    openerRef.current = trigger;
    setSelected(Number(trigger.dataset.photoIndex));
  }

  const isOpen = selected !== null;

  // Ao abrir: foco no botão Fechar e trava a rolagem do fundo, compensando a
  // largura da barra de rolagem para o layout não deslocar.
  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [isOpen]);

  function handleDialogKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    } else if (e.key === "Tab") {
      // Foco preso: Tab circula apenas entre os botões do diálogo.
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button");
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  return (
    <div className={className} onClick={handleGridClick}>
      {children}

      {isOpen && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ${selected + 1} de ${photos.length}: ${photos[selected].alt}`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 px-[6vw] py-10 focus-ring-light"
          onKeyDown={handleDialogKeyDown}
          onClick={(e) => {
            e.stopPropagation();
            close();
          }}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label="Fechar"
            className="absolute top-6 right-6 text-white text-4xl leading-none font-bold hover:text-terracotta transition-colors"
          >
            &times;
          </button>
          <Image
            src={photos[selected].src}
            alt={photos[selected].alt}
            width={1200}
            height={800}
            sizes="88vw"
            className="max-h-[85vh] max-w-full w-auto h-auto object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Foto anterior"
            className={`${NAV_BUTTON} left-2 sm:left-6`}
          >
            &lsaquo;
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Próxima foto"
            className={`${NAV_BUTTON} right-2 sm:right-6`}
          >
            &rsaquo;
          </button>
          <p className="sr-only" aria-live="polite">
            Foto {selected + 1} de {photos.length}
          </p>
        </div>
      )}
    </div>
  );
}
