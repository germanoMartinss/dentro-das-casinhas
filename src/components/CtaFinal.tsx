import Bunting from "@/components/Bunting";
import CtaLink from "@/components/CtaLink";

export default function CtaFinal() {
  return (
    <section aria-labelledby="cta-final-titulo" className="bg-cream bg-grid text-center">
      <Bunting />
      <div data-reveal className="px-[6vw] pt-16 pb-20">
        <h2
          id="cta-final-titulo"
          className="font-heading font-extrabold text-[clamp(28px,4.2vw,44px)] leading-[1.15] text-ink max-w-[760px] mx-auto mb-8"
        >
          Cada família faz parte da história.{" "}
          <span className="text-terracotta-deep">Talvez a próxima seja a sua.</span>
        </h2>
        <CtaLink className="text-[17px] px-9 py-4 shadow-cta" />
      </div>
    </section>
  );
}
