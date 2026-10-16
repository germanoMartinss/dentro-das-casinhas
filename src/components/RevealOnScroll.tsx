"use client";

import { useEffect } from "react";

/**
 * Entrada suave dos elementos marcados com data-reveal, uma vez só.
 *
 * O HTML chega com tudo visível. Depois da hidratação, só os elementos que
 * ainda estão abaixo da área visível recebem .reveal-pending (opacidade 0) e
 * passam a .reveal-play ao entrar na tela. Sem JS, sem IntersectionObserver
 * ou com "reduzir movimento", nada é escondido.
 */
export default function RevealOnScroll() {
  useEffect(() => {
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.replace("reveal-pending", "reveal-play");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    for (const el of document.querySelectorAll<HTMLElement>("[data-reveal]")) {
      if (el.getBoundingClientRect().top < window.innerHeight) continue; // já visto
      el.classList.add("reveal-pending");
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
