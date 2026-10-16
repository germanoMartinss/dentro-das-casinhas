import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Sobre from "@/components/Sobre";
import Galeria from "@/components/Galeria";
import Terapias from "@/components/Terapias";
import Convenios from "@/components/Convenios";
import Localizacao from "@/components/Localizacao";
import Depoimentos from "@/components/Depoimentos";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
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
        <Convenios />
        <Localizacao />
        <Depoimentos />
      </main>
      <Footer />
    </>
  );
}
