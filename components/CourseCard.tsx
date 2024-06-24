import React from 'react';
import { CourseStudentProps } from '../interfaces/CourseStudent';

interface CourseCardProps extends CourseStudentProps {
  onClick: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ image, name, description, profesor, categoria, onClick }) => {
  return (
    <div className="max-w-md lg:max-w-xl rounded-xl overflow-hidden shadow-lg bg-brandazul-600 ">
      <img className="w-full h-48 lg:h-60 object-cover p-3 rounded-lg" src={image} alt={name} />
      <div className="px-6 py-4">
        <div className="bg-brandmorad-600 rounded font-bold text-md mb-2 text-white p-4">{categoria}</div>
        <div className="font-bold text-md mb-2 text-white">{name}</div>
        <p className="text-brandrosado-800 text-base">
          Por: {profesor}
        </p>
        <p className="text-white text-sm overflow-hidden line-clamp-3">
          {description}
        </p>
        <div className="flex justify-end mt-4">
          <button 
            className="bg-brandmora-500 text-white px-4 rounded hover:bg-brandmorado-700 border-2 border-brandborder-400"
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
