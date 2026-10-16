import Image from "next/image";
import { TEAM } from "@/data/equipe";

const ROTATIONS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

/** Equipe em polaroids. Não renderiza nada enquanto src/data/equipe.ts estiver vazio. */
export default function Equipe() {
  if (!TEAM.length) return null;

  return (
    <section
      id="equipe"
      aria-labelledby="equipe-titulo"
      data-reveal
      className="text-center bg-sand px-[6vw] py-21"
    >
      <p className="font-hand text-[32px] text-terracotta-deep font-bold mb-1">
        quem cuida
      </p>
      <h2
        id="equipe-titulo"
        className="font-heading font-extrabold text-[clamp(28px,4vw,40px)] mb-12 text-ink"
      >
        Nossa equipe
      </h2>
      <ul className="flex flex-wrap justify-center gap-x-6 gap-y-10 max-w-[1080px] mx-auto">
        {TEAM.map((member, i) => (
          <li
            key={member.name}
            className={`w-[220px] bg-white p-3 pb-5 shadow-polaroid ${ROTATIONS[i % ROTATIONS.length]}`}
          >
            <Image
              src={member.photo}
              alt={`Foto de ${member.name}`}
              width={400}
              height={400}
              sizes="220px"
              className="w-full aspect-square object-cover"
            />
            <h3 className="font-heading text-[18px] font-bold mt-4 text-ink">{member.name}</h3>
            <p className="text-[15px] text-ink-soft">{member.specialty}</p>
            <p className="text-[13px] text-ink-subtle mt-1">{member.registration}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
