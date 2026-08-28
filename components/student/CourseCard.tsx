import React from 'react';
import { CourseStudentProps } from '../../interfaces/Courses/CourseStudent';

interface CourseCardProps extends CourseStudentProps {
  onClick: () => void;
  isJuegosIndex?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({
  image,
  name,
  description,
  profesor,
  categoria,
  onClick,
  isJuegosIndex = false,
}) => {
  return (
    <div
      className={`group rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl hover:bg-white/10 ${
        isJuegosIndex ? 'flex flex-row w-full h-auto' : 'w-full'
      }`}
    >
      <img
        className={`${
          isJuegosIndex
            ? 'w-1/3 h-auto object-cover'
            : 'w-full h-48 object-cover'
        }`}
        src={image}
        alt={name}
      />
      <div className={`px-4 py-4 ${isJuegosIndex ? 'w-2/3' : ''}`}>
        <span className="inline-block bg-brandrosado-800/20 text-brandrosado-800 rounded-full font-semibold text-xs mb-2 px-3 py-1">
          {categoria}
        </span>
        <div className="font-bold text-md mb-1 text-white">{name}</div>
        <p className="text-brandrosado-800 text-sm mb-1">Por: {profesor}</p>
        <p className="text-white/70 text-sm overflow-hidden line-clamp-3">
          {description}
        </p>
        <div className="flex justify-end mt-3">
          <button
            className="bg-brandrosado-800 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors hover:bg-brandfucsia-900"
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
