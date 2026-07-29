export default function Sobre() {
  return (
    <section
      id="sobre"
      className="relative text-center overflow-hidden px-[6vw] py-21 bg-[#EDE0C8]"
    >
      <h2
        className="font-heading font-extrabold text-[clamp(30px,4.5vw,46px)] mb-2 tracking-wide text-transparent"
        style={{ WebkitTextStroke: "2px #C9A85D" }}
      >
        A CULTURA
      </h2>
      <h2 className="font-heading font-extrabold text-[clamp(30px,4.5vw,46px)] text-[#C9A85D] mb-9 tracking-wide">
        DA CASINHA
      </h2>
      <p className="max-w-[680px] mx-auto mb-6 text-[19px] leading-[1.75] text-[#4A473F]">
        Nossa missão é{" "}
        <strong>
          &ldquo;desenvolver autonomia e independência das pessoas
          neurodivergentes através de práticas baseadas em evidências
          científicas&rdquo;
        </strong>
        . E isso é realizado diariamente com comprometimento, ética e
        acolhimento!
      </p>
      <p className="max-w-[640px] mx-auto text-[17px] leading-[1.75] text-[#6A6659]">
        É o reforço constante para que todas as ações da Casinha sejam
        feitas com empatia, dedicação e responsabilidade, e assim, sejamos
        capazes de transformar cada vez mais casinhas através da ciência.
      </p>
    </section>
  );
}
