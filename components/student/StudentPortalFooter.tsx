import React from "react";

export default function StudentPortalFooter() {
  return (
    <div
      className="bg-no-repeat bg-cover bg-brand-100"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dk2red18f/image/upload/v1724349813/WEB_EDUCA/icddbyrq4uovlhf6332o.png')",
        minHeight: "500px",
      }}
    >
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-10 lg:pt-60 lg:pb-10 px-6 lg:pl-40 text-white">
        <div className="flex justify-center">
          <img
            src="https://res.cloudinary.com/dk2red18f/image/upload/v1770755434/WEB_EDUCA/LOGO_A365_BLANCO_sin_texto_dnmnm9.png"
            alt="Logo"
            className="h-20 lg:h-30"
          />
        </div>

        <div className="pl-0 lg:pl-10">
          <h3 className="font-semibold text-lg">PÁGINAS</h3>
          <ul>
            <li>INICIO</li>
            <li>RECURSOS</li>
            <li>BENEFICIOS</li>
            <li>SUSCRÍBETE</li>
          </ul>
        </div>

        <div className="pl-0 lg:pl-10">
          <h3 className="font-semibold text-lg">LINKS</h3>
          <ul>
            <li>TÉRMINOS Y CONDICIONES</li>
            <li>POLÍTICA DE PRIVACIDAD</li>
          </ul>
        </div>

        <div className="pl-0 lg:pl-10">
          <h3 className="font-semibold text-lg">CONTÁCTANOS</h3>
          <ul>
            <li>+51 9912785156</li>
            <li>administrador.app@ceec.com.pe</li>
            <li>MAGDALENA DEL MAR - LIMA</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
