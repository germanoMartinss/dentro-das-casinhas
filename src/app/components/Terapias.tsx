type IconKey = "puzzle" | "speech" | "hand" | "heart" | "footprints" | "book";

const ICONS: Record<IconKey, React.ReactNode> = {
  puzzle: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 3h4a1 1 0 0 1 1 1v2a2 2 0 1 0 0 4v2a1 1 0 0 1-1 1h-2a2 2 0 1 1-4 0H5a1 1 0 0 1-1-1v-4a2 2 0 1 0 0-4V3a1 1 0 0 1 1-1h4v1z"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  speech: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 5h16v11H9l-4 4v-4H4V5z"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  hand: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 12V4.5a1.5 1.5 0 0 1 3 0V11m3 1V6.5a1.5 1.5 0 0 1 3 0V13m-9-1v9m9-8v3c0 3-2 6-6 6h-1c-3 0-5-1.5-6-4l-2-4.5c-.5-1 .3-2 1.3-1.7L7 12"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  heart: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 20s-7-4.4-9.3-9C1.2 8 2.5 5 6 5c2 0 3.5 1.2 4.3 2.6C11 6.2 12.5 5 14.5 5c3.5 0 4.8 3 3.3 6-2.3 4.6-9.3 9-9.3 9z"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  footprints: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <ellipse cx="8" cy="8" rx="3" ry="4" stroke="#fff" strokeWidth="1.6" />
      <ellipse cx="16" cy="15" rx="3" ry="4" stroke="#fff" strokeWidth="1.6" />
    </svg>
  ),
  book: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 5c2-1 5-1 8 0v14c-3-1-6-1-8 0V5zm16 0c-2-1-5-1-8 0v14c3-1 6-1 8 0V5z"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const SERVICES: { icon: IconKey; bg: string; title: string; desc: string }[] = [
  {
    icon: "puzzle",
    bg: "#8993A6",
    title: "Terapia ABA",
    desc: "Análise do Comportamento Aplicada, com planos individualizados baseados em evidências.",
  },
  {
    icon: "speech",
    bg: "#D9713C",
    title: "Fonoaudiologia",
    desc: "Desenvolvimento da comunicação, fala e linguagem em ritmo próprio.",
  },
  {
    icon: "hand",
    bg: "#A9C6B5",
    title: "Terapia Ocupacional",
    desc: "Estímulo à autonomia nas atividades do dia a dia.",
  },
  {
    icon: "heart",
    bg: "#E8C15F",
    title: "Psicologia",
    desc: "Acompanhamento emocional para a criança e orientação para a família.",
  },
  {
    icon: "footprints",
    bg: "#8993A6",
    title: "Fisioterapia",
    desc: "Trabalho motor e sensorial para um desenvolvimento pleno.",
  },
  {
    icon: "book",
    bg: "#D9713C",
    title: "Psicopedagogia",
    desc: "Apoio à aprendizagem, respeitando o tempo de cada criança.",
  },
];

export default function Terapias() {
  return (
    <section id="terapias" className="text-center bg-[#E7D9BC] px-[6vw] py-21">
      <p className="font-hand text-[32px] text-terracotta font-bold mb-1">
        como cuidamos
      </p>
      <h2 className="font-heading font-extrabold text-[clamp(28px,4vw,40px)] mb-12 text-[#3D3A34]">
        Terapias &amp; Serviços
      </h2>

      <div className="grid gap-6 max-w-[1080px] mx-auto grid-cols-[repeat(auto-fit,minmax(230px,1fr))]">
        {SERVICES.map((svc) => (
          <div
            key={svc.title}
            className="bg-white rounded-3xl p-8 px-6 text-left shadow-[0_4px_0_rgba(61,58,52,0.06)]"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-[18px]"
              style={{ background: svc.bg }}
            >
              {ICONS[svc.icon]}
            </div>
            <h3 className="font-heading text-[19px] font-bold mb-2 text-[#3D3A34]">
              {svc.title}
            </h3>
            <p className="text-[15px] leading-[1.55] text-[#6A6659]">
              {svc.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
