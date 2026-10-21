"use client";

import { ABRIR_PRE_CADASTRO } from "@/components/PreCadastro";

type Props = {
  className?: string;
  onClick?: () => void;
};

/** Botão "Faça o pré-cadastro": abre o formulário (PreCadastro) montado na página. */
export default function PreCadastroButton({ className = "", onClick }: Props) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={() => {
        onClick?.();
        window.dispatchEvent(new Event(ABRIR_PRE_CADASTRO));
      }}
      className={`inline-block bg-mustard text-ink font-extrabold rounded-full border-2 border-ink/15 hover:bg-[#f0cd73] transition-colors cursor-pointer whitespace-nowrap ${className}`}
    >
      Faça o pré-cadastro
    </button>
  );
}
