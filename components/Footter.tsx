import React from 'react';

interface FooterProps {
  footerText: string;
}

const Footer: React.FC<FooterProps> = ({ footerText = '2024 EducaWeb. Todos los derechos reservados.' }) => {
  return (
    <footer className="relative bg-brand-500 text-white py-6">
      {/* Imagen de fondo */}
      <div
        className="bg-no-repeat bg-cover"
        style={{
          backgroundImage: "url('https://res.cloudinary.com/dk2red18f/image/upload/v1724349813/WEB_EDUCA/icddbyrq4uovlhf6332o.png')",
          height: '500px',
        }}
      >
        <div className="container mx-auto grid grid-cols-4 gap-4 pt-60 pl-40">
          {/* Primera columna: Logo */}
          <div className="flex justify-center ">
            <img
              src="https://res.cloudinary.com/dk2red18f/image/upload/v1724350020/WEB_EDUCA/fcnjkq9hugpf6zo6pubs.png"
              alt="Logo"
              className="h-30"
            />
          </div>

          {/* Segunda columna: Títulos y textos */}
          <div className='pl-40'>
            <h3 className="font-semibold text-lg ">PÁGINAS</h3>
            <ul>
              <li>INICIO</li>
              <li>RECURSOS</li>
              <li>BENEFICIOS</li>
              <li>SUSCRÍBETE</li>
            </ul>
          </div>

          {/* Tercera columna */}
          <div className='pl-20'>
            <h3 className="font-semibold text-lg ">LINKS</h3>
            <ul>
              <li>TÉRMINOS Y CONDICIONES</li>
              <li>POLÍTICA DE PRIVACIDAD</li>
           
            </ul>
          </div>

          {/* Cuarta columna */}
          <div>
            <h3 className="font-semibold text-lg">CONTÁCTANOS</h3>
            <ul>
              <li>+51 9912785156</li>
              <li>administrador.app@ceec.com.pe</li>
              <li>MAGDALENA DEL MAR - LIMA</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contenedor gris con el texto del footer */}
      <div className="bg-brand-500 text-white pt-10">
        <p className="text-center text-sm">&copy; {footerText}</p>
      </div>
    </footer>
  );
};

export default Footer;
