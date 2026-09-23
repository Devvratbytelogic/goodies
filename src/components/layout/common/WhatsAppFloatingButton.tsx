"use client";

import { useTranslations } from "next-intl";
import { FaWhatsapp } from "react-icons/fa6";
import { WHATSAPP_URL } from "@/constants/contact";

export function WhatsAppFloatingButton() {
  const t = useTranslations("Footer");

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsapp")}
      className="whatsapp-fab fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px)+1rem)] left-4 z-40 flex size-14 items-center justify-center rounded-full bg-[#128C7E] text-white shadow-[0_10px_24px_rgba(18,140,126,0.38)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#128C7E] lg:bottom-6"
    >
      <span aria-hidden className="whatsapp-fab__ring" />
      <FaWhatsapp aria-hidden className="relative size-7" />
    </a>
  );
}
