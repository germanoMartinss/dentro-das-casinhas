/** Cores da marca usadas como destaque em ícones, bandeirinhas e fitas. */
export type BrandColor = "slate" | "mustard" | "sage" | "terracotta";

export type NavLink = {
  /** Âncora de uma seção da página, ex.: "#sobre". */
  href: `#${string}`;
  label: string;
};

export type TherapyIcon =
  | "puzzle"
  | "speech"
  | "hand"
  | "heart"
  | "footprints"
  | "book";

export type Therapy = {
  icon: TherapyIcon;
  color: BrandColor;
  title: string;
  description: string;
};

export type InsurancePlan = {
  name: string;
  /** Caminho a partir de /public; arquivo gerado por scripts/normalizar-logo.mjs. */
  logo: string;
};

export type GalleryPhoto = {
  /** Caminho a partir de /public. */
  src: string;
  alt: string;
};

export type SocialNetwork = "instagram" | "youtube" | "tiktok" | "kwai";

export type SocialLink = {
  network: SocialNetwork;
  label: string;
  href: string;
};

export type StepIcon = "chat" | "welcome" | "plan" | "family";

export type Step = {
  icon: StepIcon;
  color: BrandColor;
  title: string;
  description: string;
};

export type FaqItem = {
  question: string;
  /** null = resposta ainda não fornecida pela clínica; o item não aparece no site. */
  answer: string | null;
  /** O que falta confirmar com a clínica (não aparece no site). */
  todo?: string;
};

export type TeamMember = {
  name: string;
  specialty: string;
  /** Registro profissional, ex.: "CRP 06/123456". */
  registration: string;
  /** Caminho a partir de /public (foto quadrada, de preferência 600x600). */
  photo: string;
};

export type Testimonial = {
  quote: string;
  /** Como a família autorizou ser identificada, ex.: "Ana, mãe do Pedro". */
  author: string;
  relation?: string;
};
