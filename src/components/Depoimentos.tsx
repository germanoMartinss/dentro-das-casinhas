const TESTIMONIALS = [
  {
    quote:
      "Vimos nosso filho ganhar mais autonomia em poucos meses. A equipe trata cada criança com muito carinho e profissionalismo.",
    name: "Nome do responsável",
    role: "Mãe de paciente",
  },
  {
    quote:
      "Sentimos acolhimento desde a primeira visita. Hoje conseguimos acompanhar cada evolução de perto.",
    name: "Nome do responsável",
    role: "Pai de paciente",
  },
  {
    quote:
      "A comunicação com a equipe é muito clara. Recomendamos a Casinha para outras famílias.",
    name: "Nome do responsável",
    role: "Mãe de paciente",
  },
];

export default function Depoimentos() {
  return (
    <section id="depoimentos" className="text-center bg-cream px-[6vw] py-21">
      <p className="font-hand text-[32px] text-terracotta font-bold mb-1">
        quem já passou pela porta
      </p>
      <h2 className="font-heading font-extrabold text-[clamp(28px,4vw,40px)] mb-11 text-ink">
        Depoimentos
      </h2>

      <div className="grid gap-6 max-w-[1080px] mx-auto grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
        {TESTIMONIALS.map((t, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl px-6 py-7 text-left shadow-card"
          >
            <svg width="32" height="25" viewBox="0 0 28 22" fill="none" className="mb-3">
              <path
                d="M0 22V13.5C0 6 4.5 1 11 0l1.5 3.5C8 5 5.5 7.5 5.5 11h6.5v11H0zm15 0V13.5C15 6 19.5 1 26 0l1.5 3.5C23 5 20.5 7.5 20.5 11H27v11H15z"
                className="fill-mustard"
              />
            </svg>
            <p className="text-[15.5px] leading-relaxed text-ink-soft mb-[18px]">
              &ldquo;{t.quote}&rdquo;
            </p>
            <p className="font-extrabold text-sm text-ink">{t.name}</p>
            <p className="text-[13px] text-slate mt-0.5">{t.role}</p>
          </div>
        ))}
      </div>
      <p className="mt-7 text-[12.5px] text-ink-faint italic">
        Depoimentos ilustrativos — substituir por relatos reais de famílias
        atendidas.
      </p>
    </section>
  );
}
