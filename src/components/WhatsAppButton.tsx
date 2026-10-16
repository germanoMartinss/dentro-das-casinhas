import WhatsAppIcon from "@/components/WhatsAppIcon";
import { WHATSAPP_CONFIRMADO, WHATSAPP_URL } from "@/lib/site";

/**
 * Botão flutuante do WhatsApp (só com WHATSAPP_CONFIRMADO). No mobile o
 * rodapé ganha espaço extra embaixo para o botão não cobrir o último conteúdo.
 */
export default function WhatsAppButton() {
  if (!WHATSAPP_CONFIRMADO) return null;

  return (
    <aside aria-label="Contato rápido">
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar pelo WhatsApp (abre em nova aba)"
      className="fixed z-40 right-4 bottom-4 sm:right-6 sm:bottom-6 w-14 h-14 rounded-full bg-whatsapp hover:bg-whatsapp-dark text-white flex items-center justify-center shadow-[0_8px_20px_rgba(61,58,52,0.3)] transition-colors"
    >
      <WhatsAppIcon size={30} />
    </a>
    </aside>
  );
}
