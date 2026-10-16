import FaqAccordion from "@/components/FaqAccordion";
import { ANSWERED_FAQ } from "@/data/faq";

export default function Faq() {
  if (!ANSWERED_FAQ.length) return null;

  return (
    <section
      id="duvidas"
      aria-labelledby="duvidas-titulo"
      data-reveal
      className="bg-sand px-[6vw] py-21"
    >
      <div className="max-w-[760px] mx-auto">
        <p className="font-hand text-[32px] text-terracotta-deep font-bold mb-1 text-center">
          ficou alguma dúvida?
        </p>
        <h2
          id="duvidas-titulo"
          className="font-heading font-extrabold text-[clamp(28px,4vw,40px)] mb-10 text-ink text-center"
        >
          Perguntas frequentes
        </h2>
        <FaqAccordion
          items={ANSWERED_FAQ.map(({ question, answer }) => ({ question, answer: answer as string }))}
        />
      </div>
    </section>
  );
}
