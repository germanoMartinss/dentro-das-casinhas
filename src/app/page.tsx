import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Sobre from "@/components/Sobre";
import Galeria from "@/components/Galeria";
import Terapias from "@/components/Terapias";
import Convenios from "@/components/Convenios";
import Localizacao from "@/components/Localizacao";
import Depoimentos from "@/components/Depoimentos";
import ComoFunciona from "@/components/ComoFunciona";
import Equipe from "@/components/Equipe";
import Faq from "@/components/Faq";
import CtaFinal from "@/components/CtaFinal";
import RevealOnScroll from "@/components/RevealOnScroll";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";
import { clinicJsonLd, serializeJsonLd } from "@/lib/json-ld";

// A página é estática; regera uma vez por dia para o ano do rodapé
// acompanhar a virada do ano sem precisar de um novo deploy.
export const revalidate = 86400;

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(clinicJsonLd) }}
      />
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-ink focus:text-white focus:font-bold focus:px-4 focus:py-3 focus:rounded-xl"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <Sobre />
        <Galeria />
        <Terapias />
        <ComoFunciona />
        <Convenios />
        <Equipe />
        <Depoimentos />
        <Faq />
        <Localizacao />
        <CtaFinal />
      </main>
      <Footer />
      <WhatsAppButton />
      <RevealOnScroll />
    </>
  );
}
