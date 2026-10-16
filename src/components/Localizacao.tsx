import { ADDRESS_LINES, GOOGLE_FORM_URL, MAP_EMBED_URL, PHONE } from "@/lib/site";

export default function Localizacao() {
  return (
    <section
      id="localizacao"
      aria-labelledby="localizacao-titulo"
      className="text-center bg-slate px-[6vw] py-21 focus-ring-light"
    >
      <p className="font-hand text-[34px] text-ink font-bold mb-1">
        venha nos conhecer
      </p>
      <h2
        id="localizacao-titulo"
        className="font-heading font-extrabold text-[clamp(28px,4vw,40px)] mb-10 text-white"
      >
        A Casinha está esperando para te receber!
      </h2>

      <div className="flex flex-wrap gap-10 max-w-[980px] mx-auto items-center justify-center">
        <div className="flex-1 min-w-[380px] max-w-[460px] aspect-[4/3] rounded-3xl overflow-hidden shadow-map">
          <iframe
            title="Localização Dentro Das Casinhas no mapa"
            src={MAP_EMBED_URL}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="flex-1 min-w-[320px] max-w-[400px] text-left">
          <div className="flex gap-3.5 mb-[22px]">
            <div className="shrink-0 w-[50px] h-[50px] rounded-2xl bg-terracotta flex items-center justify-center">
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 2C7.6 2 4 5.6 4 10c0 6.4 8 12 8 12s8-5.6 8-12c0-4.4-3.6-8-8-8z"
                  stroke="#fff"
                  strokeWidth="2"
                />
                <circle cx="12" cy="10" r="3" fill="#fff" />
              </svg>
            </div>
            <div>
              <p className="font-extrabold text-[15px] mb-1 text-white">Endereço</p>
              <p className="text-[15px] text-linen leading-normal">
                {ADDRESS_LINES[0]}
                <br />
                {ADDRESS_LINES[1]}
              </p>
            </div>
          </div>
          <div className="flex gap-3.5 mb-7">
            <div className="shrink-0 w-[50px] h-[50px] rounded-2xl bg-sage flex items-center justify-center">
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 4c0 9 7 16 16 16v-3.5l-4.5-1.5-2 2c-2.5-1.2-4.5-3.2-5.7-5.7l2-2L8.3 4H4z"
                  fill="#fff"
                />
              </svg>
            </div>
            <div>
              <p className="font-extrabold text-[15px] mb-1 text-white">Telefone</p>
              <p className="text-[15px] text-linen">
                <a href={`tel:${PHONE.e164}`}>{PHONE.display}</a>
              </p>
            </div>
          </div>
          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-terracotta text-white font-extrabold text-base px-[30px] py-3.5 rounded-full shadow-cta hover:bg-terracotta-hover transition-colors"
          >
            Agende uma visita
          </a>
        </div>
      </div>
    </section>
  );
}
