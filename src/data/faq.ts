import { INSURANCE_PLANS } from "@/data/convenios";
import { PHONE } from "@/lib/site";
import type { FaqItem } from "@/types";

const planNames = INSURANCE_PLANS.map((plan) => plan.name);
const planList = `${planNames.slice(0, -1).join(", ")} e ${planNames.at(-1)}`;

/**
 * Perguntas frequentes. Itens com `answer: null` ficam fora do site até a
 * clínica fornecer a resposta; o `todo` diz o que falta.
 */
export const FAQ: FaqItem[] = [
  {
    question: "A Casinha aceita o meu convênio?",
    answer: `Atendemos ${planList}. Se o seu convênio não está na lista, fale com a gente pelo telefone ${PHONE.display}.`,
    todo: "TODO(clínica): informar se há atendimento particular e se a clínica fornece documentos para reembolso.",
  },
  {
    question: "Qual idade é atendida?",
    answer: null,
    todo: "TODO(clínica): informar a faixa etária atendida.",
  },
  {
    question: "Como funciona a primeira visita?",
    answer: null,
    todo: "TODO(clínica): descrever a primeira visita (duração, quem participa, o que trazer, se tem custo).",
  },
  {
    question: "Como faço para agendar?",
    answer: `Ligue para ${PHONE.display} e combinamos o melhor dia e horário para a sua família conhecer a Casinha.`,
    todo: "TODO(clínica): incluir o link do formulário de agendamento e o WhatsApp quando confirmados.",
  },
];

export const ANSWERED_FAQ = FAQ.filter((item) => item.answer !== null);
