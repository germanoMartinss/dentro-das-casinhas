import type { ReactNode } from "react";
import Image from "next/image";
import { ADDRESS_LINES, PHONE, SOCIAL_LINKS, logoWidthFor } from "@/lib/site";
import type { SocialNetwork } from "@/types";

const SOCIAL_ICONS: Record<SocialNetwork, ReactNode> = {
  instagram: (
    <svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" className="stroke-cream">
      <rect x="3" y="3" width="18" height="18" rx="5" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.2" className="fill-cream stroke-none" />
    </svg>
  ),
  youtube: (
    <svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none">
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" strokeWidth="2" className="stroke-cream" />
      <path d="M10.5 9.5l5 2.5-5 2.5v-5z" className="fill-cream" />
    </svg>
  ),
  tiktok: (
    <svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none">
      <path
        d="M16.5 3c.4 2.2 1.8 3.6 4 3.9v2.9c-1.4.1-2.8-.3-4-1.1v6.2c0 3.4-2.7 5.6-5.7 5.6-3 0-5.5-2.3-5.5-5.5s2.5-5.5 5.5-5.5c.4 0 .7 0 1 .1v3c-.3-.1-.6-.2-1-.2-1.4 0-2.5 1.1-2.5 2.6 0 1.4 1.1 2.5 2.5 2.5 1.5 0 2.7-1.1 2.7-2.7V3h3z"
        className="fill-cream"
      />
    </svg>
  ),
  kwai: (
    <svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none">
      <path d="M4 4h5l3 5 3-5h5l-6 8 6 8h-5l-3-5-3 5H4l6-8-6-8z" className="fill-cream" />
    </svg>
  ),
};

export default function Footer() {
  return (
    <footer id="contato" className="bg-slate-deep text-cream px-[6vw] pt-14 pb-7 focus-ring-light">
      <div className="flex flex-wrap gap-10 max-w-[1080px] mx-auto mb-9 justify-between">
        <div className="max-w-[320px]">
          <Image
            src="/images/logo-white.png"
            alt="Dentro Das Casinhas, clínica multidisciplinar infantil"
            width={logoWidthFor(44)}
            height={44}
            className="h-11 w-auto mb-3.5"
          />
          <p className="text-sm leading-relaxed text-slate-pale">
            Clínica multidisciplinar especializada em intervenção para
            crianças neurodivergentes.
          </p>
        </div>

        <div>
          <h2 className="font-extrabold text-sm mb-3.5 text-white">Contato</h2>
          <p className="text-sm mb-2 text-slate-pale">
            <a href={`tel:${PHONE.e164}`}>{PHONE.display}</a>
          </p>
          <p className="text-sm text-slate-pale leading-normal">
            {ADDRESS_LINES[0]}
            <br />
            {ADDRESS_LINES[1]}
          </p>
        </div>

        <div>
          <h2 className="font-extrabold text-sm mb-3.5 text-white">
            Redes sociais
          </h2>
          <div className="flex gap-3">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.network}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-[44px] h-[44px] rounded-xl bg-cream/[0.12] flex items-center justify-center hover:bg-cream/20 focus-visible:bg-cream/20 transition-colors"
                aria-label={`${social.label} (abre em nova aba)`}
              >
                {SOCIAL_ICONS[social.network]}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-cream/[0.15] max-w-[1080px] mx-auto pt-5 text-center">
        <p className="text-[13px] text-slate-soft">
          © 2026 Dentro Das Casinhas. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
