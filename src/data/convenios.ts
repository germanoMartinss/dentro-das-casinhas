import type { InsurancePlan } from "@/types";

/**
 * Logos em /public/images/convenios, todos padronizados em 320x144px (tela
 * transparente com o logo centralizado). Para incluir um convênio novo, gere
 * o arquivo com scripts/normalizar-logo.mjs (instruções no README).
 */
export const INSURANCE_PLANS: InsurancePlan[] = [
  { name: "Amil", logo: "/images/convenios/amil.png" },
  { name: "Bradesco Saúde", logo: "/images/convenios/bradesco-saude.png" },
  { name: "Porto Saúde", logo: "/images/convenios/porto-saude.png" },
  { name: "Mediservice", logo: "/images/convenios/mediservice.png" },
  { name: "New Leader", logo: "/images/convenios/new-leader.png" },
  { name: "Fundação Saúde Itaú", logo: "/images/convenios/fundacao-saude-itau.png" },
  { name: "Life Empresarial", logo: "/images/convenios/life-empresarial.png" },
];
