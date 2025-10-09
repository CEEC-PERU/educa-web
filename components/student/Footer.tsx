import React from 'react';

export default function Footer() {
  return (
    <footer
      className="bg-no-repeat bg-cover bg-center bg-brand-100 min-h-[400px] md:min-h-[450px] lg:min-h-[500px]"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dk2red18f/image/upload/v1724349813/WEB_EDUCA/icddbyrq4uovlhf6332o.png')",
      }}
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-12 pt-16 md:pt-32 lg:pt-60 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {/* Logo */}
          <section className="flex justify-center md:justify-start">
            <img
              src="https://res.cloudinary.com/dk2red18f/image/upload/v1724350020/WEB_EDUCA/fcnjkq9hugpf6zo6pubs.png"
              alt="MentorMind Logo"
              className="h-24 md:h-28 lg:h-32 object-contain"
            />
          </section>

          {/* Pages */}
          <nav className="text-center md:text-left lg:pl-8">
            <h3 className="font-semibold text-lg mb-4">PÁGINAS</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-brand-200 transition-colors duration-200"
                >
                  INICIO
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-brand-200 transition-colors duration-200"
                >
                  RECURSOS
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-brand-200 transition-colors duration-200"
                >
                  BENEFICIOS
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-brand-200 transition-colors duration-200"
                >
                  SUSCRÍBETE
                </a>
              </li>
            </ul>
          </nav>

          {/* Legal Links */}
          <nav className="text-center md:text-left">
            <h3 className="font-semibold text-lg mb-4">LINKS</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-brand-200 transition-colors duration-200 text-sm md:text-base"
                >
                  TÉRMINOS Y CONDICIONES
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-brand-200 transition-colors duration-200 text-sm md:text-base"
                >
                  POLÍTICA DE PRIVACIDAD
                </a>
              </li>
            </ul>
          </nav>

          {/* Contact Information */}
          <address className="not-italic text-center md:text-left">
            <h3 className="font-semibold text-lg mb-4">CONTÁCTANOS</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-brand-200 transition-colors duration-200"
                >
                  +51 991 278 5156
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-brand-200 transition-colors duration-200 break-all text-sm md:text-base"
                >
                  administrador.app@ceec.com.pe
                </a>
              </li>
              <li className="text-sm md:text-base">MAGDALENA DEL MAR - LIMA</li>
            </ul>
          </address>
        </div>
      </div>
    </footer>
  );
}
