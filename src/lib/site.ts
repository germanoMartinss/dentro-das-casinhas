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

/** Dimensões reais dos arquivos de logo da marca (logo-ink/logo-white.png). */
export const LOGO_SIZE = { width: 399, height: 501 };

/** Largura do logo para uma altura de exibição, mantendo a proporção real. */
export const logoWidthFor = (height: number) =>
  Math.round((height * LOGO_SIZE.width) / LOGO_SIZE.height);

/** Anos de atuação da clínica (faixa de confiança do hero). */
export const YEARS_OF_CARE = 6;

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

export const FULL_ADDRESS = `${ADDRESS.street}, ${ADDRESS.neighborhood}, ${ADDRESS.city} - ${ADDRESS.state}`;

/** Mapa incorporado (iframe) do Google Maps apontando para o endereço. */
export const MAP_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(FULL_ADDRESS)}&z=16&output=embed`;

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
