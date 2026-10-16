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
      <Header />
      <main>
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
