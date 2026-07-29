import Image from "next/image";

export default function Footer() {
  return (
    <footer id="contato" className="bg-[#5B6478] text-cream px-[6vw] pt-14 pb-7">
      <div className="flex flex-wrap gap-10 max-w-[1080px] mx-auto mb-9 justify-between">
        <div className="max-w-[320px]">
          <Image
            src="/images/logo-white.png"
            alt="Dentro Das Casinhas"
            width={140}
            height={44}
            className="h-11 w-auto mb-3.5"
          />
          <p className="text-sm leading-relaxed text-[#C7CCD8]">
            Clínica multidisciplinar especializada em intervenção para
            crianças neurodivergentes.
          </p>
        </div>

        <div>
          <p className="font-extrabold text-sm mb-3.5 text-white">Contato</p>
          <p className="text-sm mb-2 text-[#C7CCD8]">(13) 98214-6166</p>
          <p className="text-sm text-[#C7CCD8] leading-normal">
            Av. Presidente Costa e Silva, 1500,
            <br />
            Boqueirão, Praia Grande - SP
          </p>
        </div>

        <div>
          <p className="font-extrabold text-sm mb-3.5 text-white">
            Redes sociais
          </p>
          <div className="flex gap-3">
            <a
              href="#"
              className="w-[44px] h-[44px] rounded-xl bg-cream/[0.12] flex items-center justify-center hover:bg-cream/20 transition-colors"
              aria-label="Instagram"
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                  stroke="#F4ECDC"
                  strokeWidth="2"
                />
                <circle cx="12" cy="12" r="4" stroke="#F4ECDC" strokeWidth="2" />
                <circle cx="17.5" cy="6.5" r="1.2" fill="#F4ECDC" />
              </svg>
            </a>
            <a
              href="#"
              className="w-[44px] h-[44px] rounded-xl bg-cream/[0.12] flex items-center justify-center hover:bg-cream/20 transition-colors"
              aria-label="Facebook"
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 8h3V4h-3c-2.2 0-4 1.8-4 4v3H8v4h3v7h4v-7h3l1-4h-4V8c0-.5.5-1 1-1z"
                  fill="#F4ECDC"
                />
              </svg>
            </a>
            <a
              href="#"
              className="w-[44px] h-[44px] rounded-xl bg-cream/[0.12] flex items-center justify-center hover:bg-cream/20 transition-colors"
              aria-label="Twitter"
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 5.5c-.7.3-1.5.5-2.3.6a4 4 0 0 0 1.7-2.2c-.8.5-1.6.8-2.6 1a4 4 0 0 0-6.8 3.6A11.3 11.3 0 0 1 3.2 4.4a4 4 0 0 0 1.2 5.3c-.6 0-1.2-.2-1.7-.5v.1a4 4 0 0 0 3.2 3.9c-.6.1-1.2.2-1.8.1a4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 17.9a11.3 11.3 0 0 0 6.1 1.8c7.3 0 11.3-6 11.3-11.3v-.5c.8-.6 1.4-1.3 2-2.1a8 8 0 0 1-2.4.6z"
                  fill="#F4ECDC"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-cream/[0.15] max-w-[1080px] mx-auto pt-5 text-center">
        <p className="text-[13px] text-[#A5ACBB]">
          © 2026 Dentro Das Casinhas. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
