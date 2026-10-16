import { INSURANCE_PLANS } from "@/data/convenios";
import { THERAPIES } from "@/data/terapias";
import { YEARS_OF_CARE } from "@/lib/site";

export type Highlight = { value: number; label: string };

/** Faixa de confiança abaixo do hero; os números vêm dos próprios dados. */
export const HIGHLIGHTS: Highlight[] = [
  { value: YEARS_OF_CARE, label: "anos de cuidado" },
  { value: THERAPIES.length, label: "terapias" },
  { value: INSURANCE_PLANS.length, label: "convênios" },
];
