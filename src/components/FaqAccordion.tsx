"use client";

import { useId, useState } from "react";

type Props = { items: { question: string; answer: string }[] };

/**
 * Sanfona acessível: cada pergunta é um <button> com aria-expanded e
 * aria-controls apontando para a resposta. Funciona com Tab, Enter e Espaço.
 * Sem JS, o <noscript> abaixo deixa todas as respostas visíveis.
 */
export default function FaqAccordion({ items }: Props) {
  const baseId = useId();
  const [open, setOpen] = useState<Set<number>>(() => new Set());

  function toggle(i: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <>
      <noscript>
        <style>{"[data-faq-panel]{display:block!important}"}</style>
      </noscript>
      <ul className="flex flex-col gap-3">
        {items.map((item, i) => {
          const isOpen = open.has(i);
          const buttonId = `${baseId}-pergunta-${i}`;
          const panelId = `${baseId}-resposta-${i}`;
          return (
            <li key={item.question} className="bg-white rounded-2xl shadow-card">
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-4 text-left px-6 py-5 font-heading font-bold text-[18px] text-ink rounded-2xl hover:text-terracotta-deep transition-colors"
                >
                  {item.question}
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className={`shrink-0 stroke-terracotta-deep transition-transform duration-200 motion-reduce:transition-none ${isOpen ? "rotate-45" : ""}`}
                    fill="none"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                data-faq-panel
                hidden={!isOpen}
                className="px-6 pb-5 -mt-1 text-[16px] leading-[1.65] text-ink-soft"
              >
                {item.answer}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
