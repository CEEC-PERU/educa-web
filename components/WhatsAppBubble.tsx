import React, { useEffect, useRef, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { X, Sparkles, ArrowRight } from "lucide-react";
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
        className={`w-80 origin-bottom-right rounded-2xl border border-white/10 bg-gradient-to-br from-brandfucsia-900 to-brandmorado-700 p-5 shadow-2xl transition-all duration-200 ${
          isOpen
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brandrosado-800" />
          <span className="text-sm font-bold text-white">¿Tienes dudas?</span>
        </div>
        <p className="mb-4 text-sm text-white/80">
          Nuestro equipo de soporte está listo para ayudarte a resolver
          cualquier consulta sobre tu ruta de aprendizaje.
        </p>

        <div className="mb-4 flex items-end gap-1">
          <div className="flex-1 rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-sm text-gray-800 shadow">
            {WHATSAPP_BUBBLE_MESSAGE}
          </div>
          <img
            src="/robot-bubble.png"
            alt=""
            aria-hidden="true"
            className="-mb-2 -mr-2 h-16 w-16 shrink-0 object-contain drop-shadow-lg"
          />
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-brandfucsia-900 transition hover:bg-white/90"
        >
          <FaWhatsapp className="h-4 w-4" />
          Escríbenos por WhatsApp
          <ArrowRight className="h-4 w-4" />
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
