"use client";

import { useState, type ReactNode } from "react";

/**
 * Faixa de logos rolando devagar. Pausa no hover, no foco e pelo botão
 * (WCAG 2.2.2: movimento contínuo precisa de um jeito de parar, inclusive no
 * toque). Com "reduzir movimento" o CSS deixa a faixa parada, em grade.
 */
export default function ConveniosMarquee({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false);

  return (
    <div className="marquee group/marquee" data-paused={paused}>
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
        <div className="marquee-track flex w-max">{children}</div>
      </div>
      <button
        type="button"
        aria-pressed={paused}
        onClick={() => setPaused((p) => !p)}
        className="marquee-toggle mt-6 inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-sm px-4 py-2 transition-colors focus-ring-light"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className="fill-white">
          {paused ? <path d="M3 1.5v11l9-5.5z" /> : <path d="M3 1.5h3v11H3zm5 0h3v11H8z" />}
        </svg>
        {paused ? "Retomar animação" : "Pausar animação"}
      </button>
    </div>
  );
}
