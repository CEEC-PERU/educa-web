"use client";
import { useState } from "react";
import Link from "next/link";
import { Twitter, Instagram, Linkedin } from "lucide-react";
import Modal from "./Admin/Modal";
import PrivacyPolicyContent from "./PrivacyPolicyContent";

export default function Footer() {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  return (
    <footer className="bg-gradient-to-r  from-brand-100 via-brand-200 to-brand-300 p-4 py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          {/* Redes sociales */}
          <div className="w-full md:w-auto mb-12 md:mb-0">
            <h3 className="text-sm font-bold mb-6 text-white">Síguenos</h3>
            <div className="flex space-x-4 mb-8">
              <Link
                href="#"
                className="bg-purple-600 p-3 rounded-full hover:bg-purple-700 transition-colors"
              >
                <Twitter className="h-5 w-5 text-white" />
              </Link>
              <Link
                href="#"
                className="bg-purple-600 p-3 rounded-full hover:bg-purple-700 transition-colors"
              >
                <Instagram className="h-5 w-5 text-white" />
              </Link>
              <Link
                href="https://www.linkedin.com/company/qtech-experience"
                className="bg-purple-600 p-3 rounded-full hover:bg-purple-700 transition-colors"
              >
                <Linkedin className="h-5 w-5 text-white" />
              </Link>
            </div>
          </div>

          {/* Enlaces */}
          <div className="w-full md:w-auto mb-12 md:mb-0">
            <h3 className="text-sm font-bold mb-6 text-white">PAGINAS</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Recursos
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Beneficios
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="w-full md:w-auto mb-12 md:mb-0">
            <h3 className="text-sm font-bold mb-6 text-white">LINKS</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <button
                  type="button"
                  onClick={() => setShowPrivacyPolicy(true)}
                  className="hover:text-white transition-colors"
                >
                  POLÍTICA DE PRIVACIDAD
                </button>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="w-full md:w-auto">
            <h3 className="text-sm font-bold mb-6 text-white">Contactanos</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>+51 965 338 844</li>
              <li>contacto@qtech.com.pe</li>
              <li>MAGDALENA DEL MAR - LIMA</li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-800 my-12"></div>
      </div>

      <Modal
        isOpen={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
        title="Política de Privacidad"
        size="lg"
      >
        <PrivacyPolicyContent />
      </Modal>
    </footer>
  );
}
