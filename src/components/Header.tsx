"use client";

import { useState } from "react";
import Image from "next/image";
import { NAV_LINKS } from "@/data/navegacao";
import { GOOGLE_FORM_URL } from "@/lib/site";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-cream border-b-2 border-ink/[0.08] flex items-center justify-between px-[5vw] py-3">
      <Image
        src="/images/logo-ink.png"
        alt="Dentro Das Casinhas"
        width={270}
        height={88}
        className="h-[88px] w-auto"
        priority
      />

      <nav className="hidden md:flex items-center gap-7">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-ink font-bold text-base hover:text-terracotta transition-colors"
          >
            {link.label}
          </a>
        ))}
        <a
          href={GOOGLE_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-terracotta text-white px-6 py-3 rounded-full font-extrabold text-base hover:bg-terracotta-hover transition-colors"
        >
          Agende uma visita
        </a>
      </nav>

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex md:hidden bg-transparent border-none cursor-pointer p-2"
        aria-label="Abrir menu"
      >
        <svg width="26" height="20" viewBox="0 0 26 20" className="fill-ink">
          <rect width="26" height="3" rx="1.5" />
          <rect y="8.5" width="26" height="3" rx="1.5" />
          <rect y="17" width="26" height="3" rx="1.5" />
        </svg>
      </button>

      {open && (
        <nav className="absolute top-full left-0 right-0 md:hidden flex flex-col gap-1 bg-cream px-[5vw] pb-5 pt-3 border-b-2 border-ink/[0.08]">
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
          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="bg-terracotta text-white px-5 py-3 rounded-full font-extrabold text-[15px] text-center mt-2"
          >
            Agende uma visita
          </a>
        </nav>
      )}
    </header>
  );
}
