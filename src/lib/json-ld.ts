import {
  ADDRESS,
  PHONE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  SOCIAL_LINKS,
} from "@/lib/site";

/** Dados estruturados (schema.org) da clínica, para buscadores. */
export const clinicJsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  "@id": `${SITE_URL}/#clinica`,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  telephone: PHONE.e164,
  image: `${SITE_URL}/opengraph-image.jpg`,
  logo: `${SITE_URL}/images/logo-ink.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${ADDRESS.street} - ${ADDRESS.neighborhood}`,
    addressLocality: ADDRESS.city,
    addressRegion: ADDRESS.state,
    addressCountry: ADDRESS.country,
  },
  sameAs: SOCIAL_LINKS.map((social) => social.href),
};

/**
 * Serializa para um <script type="application/ld+json">, escapando "<" para
 * que nenhum texto feche a tag antes da hora.
 */
export function serializeJsonLd(data: object) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
