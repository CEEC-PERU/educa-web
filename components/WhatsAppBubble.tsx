import React, { useEffect, useRef, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { X } from "lucide-react";
import {
  WHATSAPP_NUMBER,
  WHATSAPP_PREFILLED_MESSAGE,
  WHATSAPP_BUBBLE_MESSAGE,
} from "../utils/contact";

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_PREFILLED_MESSAGE,
)}`;

export default function WhatsAppBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
    >
      <div
        className={`w-72 origin-bottom-right rounded-2xl border border-black/5 bg-white p-4 shadow-2xl transition-all duration-200 ${
          isOpen
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <p className="text-sm text-gray-700">{WHATSAPP_BUBBLE_MESSAGE}</p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1DA851]"
        >
          <FaWhatsapp className="h-5 w-5" />
          Chatear por WhatsApp
        </a>
      </div>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Cerrar contacto" : "Contactar por WhatsApp"}
        aria-expanded={isOpen}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:bg-[#1DA851]"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <FaWhatsapp className="h-7 w-7" />
        )}
      </button>
    </div>
  );
}
