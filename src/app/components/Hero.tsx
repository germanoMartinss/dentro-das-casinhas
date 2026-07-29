import Image from "next/image";
import Bunting from "./Bunting";
import { GOOGLE_FORM_URL } from "../config";

export default function Hero() {
  return (
    <>
      <div className="bg-[#C9683A]">
        <Bunting />
        <div className="flex justify-center px-[6vw] pt-8 pb-9">
          <Image
            src="/images/logo-white.png"
            alt="Dentro Das Casinhas"
            width={270}
            height={175}
            className="h-[175px] w-auto"
          />
        </div>
      </div>

      <section
        className="relative text-center bg-cream overflow-hidden px-[6vw] pt-16 pb-22"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(61,58,52,0.035) 0 1.5px, transparent 1.5px 30px), repeating-linear-gradient(90deg, rgba(61,58,52,0.035) 0 1.5px, transparent 1.5px 58px)",
        }}
      >
        <div className="relative max-w-[720px] mx-auto">
          <h1 className="font-heading font-extrabold text-[clamp(32px,5vw,52px)] leading-[1.15] mb-[18px] text-[#3D3A34]">
            Cuidado que constrói{" "}
            <span className="text-terracotta">autonomia</span>, dentro de
            casa e além dela.
          </h1>
          <p className="text-[19px] leading-relaxed text-[#55524B] max-w-[560px] mx-auto mb-8">
            A Dentro Das Casinhas é uma clínica multidisciplinar
            especializada em intervenção para crianças neurodivergentes, com
            terapias baseadas em evidências científicas — feitas com ética,
            empatia e acolhimento.
          </p>
          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-terracotta text-white font-extrabold text-[17px] px-9 py-4 rounded-full shadow-[0_6px_0_rgba(61,58,52,0.15)] hover:bg-[#b8582a] transition-colors"
          >
            Agende uma visita
          </a>
        </div>
      </section>
    </>
  );
}
