import type { Step } from "@/types";

// TODO(clínica): revisar os textos para refletirem o processo real da Casinha.
export const STEPS: Step[] = [
  {
    icon: "chat",
    color: "sage",
    title: "Primeiro contato",
    description: "Você fala com a gente e conta um pouco sobre a sua criança. Sem pressa e sem compromisso.",
  },
  {
    icon: "welcome",
    color: "mustard",
    title: "Acolhimento e avaliação",
    description: "Recebemos a família na Casinha para conhecer a criança, ouvir suas dúvidas e entender as necessidades de cada um.",
  },
  {
    icon: "plan",
    color: "slate",
    title: "Plano terapêutico individual",
    description: "A equipe monta um plano com objetivos claros, pensado para o ritmo e a história da sua criança.",
  },
  {
    icon: "family",
    color: "terracotta",
    title: "Acompanhamento com a família",
    description: "Cada conquista é compartilhada. A família participa e acompanha a evolução de perto.",
  },
];
