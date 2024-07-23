import React from 'react';
import { CourseStudentProps } from '../../interfaces/CourseStudent';

interface CourseCardProps extends CourseStudentProps {
  onClick: () => void;
  isJuegosIndex?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ image, name, description, profesor, categoria, onClick, isJuegosIndex = false }) => {
  return (
    <div className={`rounded-xl overflow-hidden shadow-lg bg-brandazul-600 ${isJuegosIndex ? 'flex flex-row w-full h-auto' : 'max-w-sm lg:max-w-md xl:max-w-lg'}`}>
      <img className={`${isJuegosIndex ? 'w-1/3 h-auto' : 'w-full h-32 lg:h-40 xl:h-48'} object-cover p-3 rounded-lg`} src={image} alt={name} />
      <div className={`px-4 py-3 ${isJuegosIndex ? 'w-2/3' : ''}`}>
        <div className="bg-brandmorad-600 rounded font-bold text-md mb-2 text-white p-2">{categoria}</div>
        <div className="font-bold text-md mb-2 text-white">{name}</div>
        <p className="text-brandrosado-800 text-base">
          Por: {profesor}
        </p>
        <p className="text-white text-sm overflow-hidden line-clamp-3">
          {description}
        </p>
        <div className="flex justify-end mt-3">
          <button 
            className="bg-brandmora-500 text-white px-3 py-2 rounded hover:bg-brandmorado-700 border-2 border-brandborder-400"
            onClick={onClick}
          >
            Detalles del curso
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
