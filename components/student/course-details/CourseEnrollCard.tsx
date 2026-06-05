import React from 'react';

interface CourseEnrollCardProps {
  onStart: () => void;
}

const CourseEnrollCard: React.FC<CourseEnrollCardProps> = ({ onStart }) => (
  <div className="bg-transparent border border-gray-300 rounded p-4">
    <button
      className="bg-brandmora-500 text-white px-2 lg:px-4 py-1 lg:py-2 rounded hover:bg-brandmorado-700 border-4 border-brandborder-400 flex items-center"
      onClick={onStart}
    >
      Empezar el curso
    </button>

    <div className="bg-gradient-to-r from-brand-300 via-brand-200 to-brandazul-200 border-gray-300 rounded p-4 mt-10">
      <img
        src="https://res.cloudinary.com/dk2red18f/image/upload/v1720197722/WEB_EDUCA/ICONOS/gbm5c8g3wy1mzxncwany.png"
        className="w-4 h-4 lg:w-6 lg:h-6 mr-2"
        alt="Acceso"
      />
      <span className="text-white text-sm lg:text-base">
        Gracias a nuestro cliente, accedes a todos los cursos y beneficios de nuestro catálogo.
      </span>
      <button
        className="bg-brandmora-500 text-white px-2 lg:px-4 py-1 lg:py-2 rounded hover:bg-brandmorado-700 border-4 border-brandborder-400 flex items-center mt-4"
        onClick={onStart}
      >
        Ver catálogo de cursos
      </button>
    </div>

    <div className="bg-transparent border border-gray-300 rounded p-4 mt-4">
      <div className="flex items-center mb-2">
        <img
          src="https://res.cloudinary.com/dk2red18f/image/upload/v1720197367/WEB_EDUCA/ICONOS/usna5kpyfkorticwhawp.png"
          className="w-4 h-4 lg:w-6 lg:h-6 mr-2"
          alt="Lecciones"
        />
        <p className="text-sm lg:text-base text-white">4 Lecciones</p>
      </div>
      <div className="flex items-center mb-2">
        <img
          src="https://res.cloudinary.com/dk2red18f/image/upload/v1720197367/WEB_EDUCA/ICONOS/lvnniyn1pecmrvj98zi4.png"
          className="w-4 h-4 lg:w-6 lg:h-6 mr-2"
          alt="Nivel"
        />
        <p className="text-sm lg:text-base text-white">Nivel Intermedio</p>
      </div>
    </div>
  </div>
);

export default CourseEnrollCard;
