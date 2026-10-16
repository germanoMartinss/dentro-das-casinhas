import { TESTIMONIALS } from "@/data/depoimentos";

/** Depoimentos reais. Não renderiza nada enquanto src/data/depoimentos.ts estiver vazio. */
export default function Depoimentos() {
  if (!TESTIMONIALS.length) return null;

  return (
    <section
      id="depoimentos"
      aria-labelledby="depoimentos-titulo"
      data-reveal
      className="text-center bg-cream px-[6vw] py-21"
    >
      <p className="font-hand text-[32px] text-terracotta-deep font-bold mb-1">
        quem já passou pela porta
      </p>
      <h2
        id="depoimentos-titulo"
        className="font-heading font-extrabold text-[clamp(28px,4vw,40px)] mb-11 text-ink"
      >
        Depoimentos
      </h2>

      <ul className="grid gap-6 max-w-[1080px] mx-auto grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
        {TESTIMONIALS.map((t) => (
          <li key={t.quote} className="bg-white rounded-3xl px-6 py-7 text-left shadow-card">
            <figure>
              <svg width="32" height="25" viewBox="0 0 28 22" fill="none" className="mb-3" aria-hidden="true">
                <path
                  d="M0 22V13.5C0 6 4.5 1 11 0l1.5 3.5C8 5 5.5 7.5 5.5 11h6.5v11H0zm15 0V13.5C15 6 19.5 1 26 0l1.5 3.5C23 5 20.5 7.5 20.5 11H27v11H15z"
                  className="fill-mustard"
                />
              </svg>
              <blockquote className="text-[15.5px] leading-relaxed text-ink-soft mb-[18px]">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption>
                <span className="block font-extrabold text-sm text-ink">{t.author}</span>
                {t.relation && <span className="block text-[13px] text-ink-subtle mt-0.5">{t.relation}</span>}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
