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
