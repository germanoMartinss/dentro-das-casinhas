import type { Metadata } from "next";
import { Baloo_2, Nunito, Caveat } from "next/font/google";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "@/app/globals.css";

// Só os pesos que aparecem na página (levantados no CSS computado do build).
const baloo2 = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

// Caveat só aparece em detalhes (kickers e legenda da foto): sem preload,
// para não disputar banda com a Nunito do parágrafo do hero, que é o LCP.
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["700"],
  preload: false,
});

const TITLE = `${SITE_NAME} | Clínica multidisciplinar infantil`;

// As imagens de Open Graph/Twitter e os ícones vêm dos arquivos em src/app
// (opengraph-image.jpg, twitter-image.jpg, icon.png, apple-icon.png,
// favicon.ico), gerados por scripts/gerar-imagens-seo.mjs.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: SITE_NAME,
    title: TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${baloo2.variable} ${nunito.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
