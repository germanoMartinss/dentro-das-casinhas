import type { SocialLink } from "@/types";

/**
 * URL pública do site, sem barra final. Defina NEXT_PUBLIC_SITE_URL no
 * ambiente (ex.: na Vercel) ao trocar de domínio.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://dentro-das-casinhas.vercel.app"
).replace(/\/+$/, "");

// TODO: substituir pelo link real do Google Forms quando disponível.
export const GOOGLE_FORM_URL = "#";

export const SITE_NAME = "Dentro Das Casinhas";

export const SITE_DESCRIPTION =
  "Clínica multidisciplinar especializada em intervenção para crianças neurodivergentes, com terapias baseadas em evidências científicas.";

export const PHONE = {
  display: "(13) 98214-6166",
  /** Formato E.164, usado em links tel: e dados estruturados. */
  e164: "+5513982146166",
};

export const ADDRESS = {
  street: "Av. Presidente Costa e Silva, 1500",
  neighborhood: "Boqueirão",
  city: "Praia Grande",
  state: "SP",
  country: "BR",
};

/** Endereço em duas linhas, como exibido na página. */
export const ADDRESS_LINES = [
  `${ADDRESS.street},`,
  `${ADDRESS.neighborhood}, ${ADDRESS.city} - ${ADDRESS.state}`,
] as const;

export const SOCIAL_LINKS: SocialLink[] = [
  {
    network: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/dentrodascasinhas",
  },
  {
    network: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@Dentrodascasinhas",
  },
  {
    network: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/@dentrodascasinhas",
  },
  {
    network: "kwai",
    label: "Kwai",
    href: "https://www.kwai.com/@dentrodascasinhas",
  },
];
