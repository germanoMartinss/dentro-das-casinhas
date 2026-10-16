import type { ReactNode } from "react";
import { GOOGLE_FORM_URL } from "@/lib/site";

type Props = {
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
};

/** Botão "Agende uma visita" (link para o formulário de agendamento). */
export default function CtaLink({ className = "", children = "Agende uma visita", onClick }: Props) {
  return (
    <a
      href={GOOGLE_FORM_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`inline-block bg-terracotta-strong text-white font-extrabold rounded-full hover:bg-terracotta-deep transition-colors ${className}`}
    >
      {children}
    </a>
  );
}
