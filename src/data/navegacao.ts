import { TESTIMONIALS } from "@/data/depoimentos";
import { TEAM } from "@/data/equipe";
import { ANSWERED_FAQ } from "@/data/faq";
import type { NavLink } from "@/types";

/** Links do menu; seções que dependem de dados só entram quando existem. */
export const NAV_LINKS: NavLink[] = [
  { href: "#sobre", label: "Sobre" },
  { href: "#casinha", label: "Galeria" },
  { href: "#terapias", label: "Terapias" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#convenios", label: "Convênios" },
  ...(TEAM.length ? [{ href: "#equipe", label: "Equipe" } as const] : []),
  ...(TESTIMONIALS.length ? [{ href: "#depoimentos", label: "Depoimentos" } as const] : []),
  ...(ANSWERED_FAQ.length ? [{ href: "#duvidas", label: "Dúvidas" } as const] : []),
  { href: "#localizacao", label: "Localização" },
  { href: "#contato", label: "Contato" },
];
