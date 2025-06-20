import React from 'react';
import ButtonContent from '../Content/ButtonContent';

interface CardProps {
  imageUrl: string;
  title: string;
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
}

const CardEnterprise: React.FC<CardProps> = ({
  imageUrl,
  title,
  onEdit,
  onDelete,
  className = '',
}) => {
  return (
    <div
      className={`relative flex flex-col w-full max-w-xs sm:max-w-sm md:max-w-md rounded-xl bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
    >
      {/* Contenedor de imagen con relación de aspecto 16:9 */}
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          src={imageUrl}
          alt={title}
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="mb-3 text-lg font-semibold text-gray-800 line-clamp-2">
          {title}
        </h3>

        {/* Acciones con espaciado consistente */}
        <div className="mt-auto pt-3 flex justify-between space-x-3 border-t border-gray-100">
          <ButtonContent
            buttonLabel="Editar"
            backgroundColor="bg-blue-600 hover:bg-blue-700"
            textColor="text-white"
            fontSize="text-sm"
            buttonSize="px-3 py-2"
            onClick={onEdit}
            className="transition-colors duration-200"
          />
          <ButtonContent
            buttonLabel="Eliminar"
            backgroundColor="bg-red-600 hover:bg-red-700"
            textColor="text-white"
            fontSize="text-sm"
            buttonSize="px-3 py-2"
            onClick={onDelete}
            className="transition-colors duration-200"
          />
        </div>
      </div>
    </div>
  );
};

export default CardEnterprise;
