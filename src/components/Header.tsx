"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { NAV_LINKS } from "@/data/navegacao";
import CtaLink from "@/components/CtaLink";
import { logoWidthFor } from "@/lib/site";

const MOBILE_MENU_ID = "menu-mobile";

export default function Header() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // Ao rolar, o cabeçalho encolhe e ganha sombra.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Com o menu aberto: Esc fecha e devolve o foco ao botão; clique fora fecha.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    function onPointerDown(e: PointerEvent) {
      if (!headerRef.current?.contains(e.target as Node)) setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  // O encolhimento é só visual (transform): o contêiner sticky mantém a
  // altura de 114px, então o conteúdo da página não se desloca (CLS 0).
  const shift = scrolled ? "translate-y-[13px]" : "";

  return (
    <div className="sticky top-0 z-50 h-[114px] pointer-events-none">
    <header
      ref={headerRef}
      className={`pointer-events-auto relative bg-cream border-b-2 border-ink/[0.08] flex items-center justify-between px-[5vw] py-3 transition-[translate,box-shadow] duration-300 motion-reduce:transition-none ${scrolled ? "-translate-y-[26px] shadow-[0_6px_20px_rgba(61,58,52,0.12)]" : ""}`}
    >
      <Image
        src="/images/logo-ink.png"
        alt="Dentro Das Casinhas"
        width={logoWidthFor(88)}
        height={88}
        className={`h-[88px] w-auto origin-left transition-[translate,scale] duration-300 motion-reduce:transition-none ${scrolled ? "translate-y-[13px] scale-[0.8]" : ""}`}
        loading="eager"
      />

      <nav
        aria-label="Menu principal"
        className={`hidden xl:flex items-center gap-6 transition-[translate] duration-300 motion-reduce:transition-none ${shift}`}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-ink font-bold text-base hover:text-terracotta-deep transition-colors"
          >
            {link.label}
          </a>
        ))}
        <CtaLink className="px-6 py-3 text-base" />
      </nav>

      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex xl:hidden bg-transparent border-none cursor-pointer p-2 transition-[translate] duration-300 motion-reduce:transition-none ${shift}`}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        aria-controls={MOBILE_MENU_ID}
      >
        {open ? (
          <svg width="26" height="20" viewBox="0 0 26 20" aria-hidden="true">
            <path
              d="M5 1.5l16 17M21 1.5l-16 17"
              className="stroke-ink"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="26" height="20" viewBox="0 0 26 20" className="fill-ink" aria-hidden="true">
            <rect width="26" height="3" rx="1.5" />
            <rect y="8.5" width="26" height="3" rx="1.5" />
            <rect y="17" width="26" height="3" rx="1.5" />
          </svg>
        )}
      </button>

      <nav
        id={MOBILE_MENU_ID}
        aria-label="Menu principal (celular)"
        hidden={!open}
        className="absolute top-full left-0 right-0 xl:hidden flex flex-col gap-1 bg-cream px-[5vw] pb-5 pt-3 border-b-2 border-ink/[0.08]"
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="text-ink font-bold text-lg py-2.5"
          >
            {link.label}
          </a>
        ))}
        <CtaLink onClick={() => setOpen(false)} className="px-5 py-3 text-[15px] text-center mt-2" />
      </nav>
    </header>
    </div>
  );
}
