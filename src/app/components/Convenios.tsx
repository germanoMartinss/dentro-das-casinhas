import Image from "next/image";
import Bunting from "./Bunting";

const CONVENIOS = [
  { name: "Amil", logo: "/images/logos/amil-1.png", scale: 1.7 },
  { name: "Bradesco Saúde", logo: "/images/logos/bradesco-saude-logo-1-1.png", scale: 1 },
  { name: "Porto Saúde", logo: "/images/logos/porto-saude-1.png", scale: 1.6 },
  { name: "Mediservice", logo: "/images/logos/mediservice.png", scale: 2.1 },
  { name: "New Leader", logo: "/images/logos/newleader.png", scale: 1.7 },
  { name: "Fundação Saúde Itaú", logo: "/images/logos/logo-fundacao-itau.png", scale: 1 },
  { name: "Life Empresarial", logo: "/images/logos/logo-life.png", scale: 1.15 },
];

export default function Convenios() {
  return (
    <section
      id="convenios"
      className="relative text-center bg-[#C9683A] pb-21"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1.5px, transparent 1.5px 30px), repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 1.5px, transparent 1.5px 58px)",
      }}
    >
      <Bunting />

      <div className="px-[6vw] pt-10">
        <p className="text-cream text-xl font-bold mb-1">A Casinha atende os</p>
        <h2 className="font-heading font-extrabold text-[clamp(28px,4vw,40px)] text-white mb-3 tracking-wide">
          CONVÊNIOS:
        </h2>
        <div className="w-20 h-[3px] bg-white/40 mx-auto mb-11 rounded-full" />

        <div className="grid gap-[18px] max-w-[900px] mx-auto grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
          {CONVENIOS.map((conv) => (
            <div
              key={conv.name}
              className="bg-white rounded-2xl px-5 py-8 flex items-center justify-center min-h-[110px] overflow-hidden shadow-[0_4px_0_rgba(0,0,0,0.08)]"
            >
              <Image
                src={conv.logo}
                alt={conv.name}
                width={180}
                height={64}
                className="h-14 w-auto max-w-full object-contain"
                style={{ transform: `scale(${conv.scale})` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
