import type { Metadata } from "next";
import { Baloo_2, Nunito, Caveat } from "next/font/google";
import "./globals.css";

const baloo2 = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Dentro Das Casinhas | Clínica multidisciplinar infantil",
  description:
    "Clínica multidisciplinar especializada em intervenção para crianças neurodivergentes, com terapias baseadas em evidências científicas.",
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
      <body className="min-h-full flex flex-col font-sans text-[#3D3A34] bg-cream">
        {children}
      </body>
    </html>
  );
}
