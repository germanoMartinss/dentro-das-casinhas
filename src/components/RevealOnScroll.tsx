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

    // Navegação por teclado: o foco nunca pode cair num elemento ainda
    // invisível. Ao focar algo dentro de um bloco pendente, ele aparece na
    // hora; e se o navegador não rolar até o foco (acontece com o iframe do
    // mapa), rolamos nós.
    function revealFocused(target: Element) {
      const pending = target.closest(".reveal-pending");
      if (pending) {
        pending.classList.remove("reveal-pending");
        observer.unobserve(pending);
      }
      const r = target.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) target.scrollIntoView({ block: "center" });
    }
    const onFocusIn = (e: FocusEvent) => revealFocused(e.target as Element);
    // Foco entrando num iframe de outra origem não dispara focusin aqui, só
    // blur na janela; o iframe vira o activeElement logo depois.
    const onWindowBlur = () =>
      setTimeout(() => {
        if (document.activeElement?.tagName === "IFRAME") revealFocused(document.activeElement);
      });
    document.addEventListener("focusin", onFocusIn);
    window.addEventListener("blur", onWindowBlur);

    return () => {
      observer.disconnect();
      document.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("blur", onWindowBlur);
    };
  }, []);

  return null;
}
