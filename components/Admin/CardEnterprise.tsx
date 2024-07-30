import React from 'react';
import ButtonContent from '../Content/ButtonContent';

interface CardProps {
  imageUrl: string;
  title: string;
  onEdit: () => void;
  onDelete: () => void;
}

const CardEnterprise: React.FC<CardProps> = ({ imageUrl, title, onEdit, onDelete }) => {
  return (
    <div className="relative flex flex-col w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl rounded-xl bg-gray-200 bg-clip-border text-gray-700 shadow-lg mx-2 my-4">
      <img className="rounded-t-lg h-48 object-cover w-full" src={imageUrl} alt={title} />
      <div className="p-5">
        <h6 className="mb-4 mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h6>
        <div className="pt-4 px-2 flex justify-between space-x-4">
          <ButtonContent
            buttonLabel="Editar"
            backgroundColor="bg-gradient-to-r from-blue-500 to-blue-400"
            textColor="text-white"
            fontSize="text-sm"
            buttonSize="px-2 py-2"
            onClick={onEdit}
          />
          <ButtonContent
            buttonLabel="Eliminar"
            backgroundColor="bg-gradient-to-r from-red-500 to-red-400"
            textColor="text-white"
            fontSize="text-sm"
            buttonSize="px-2 py-2"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default CardEnterprise;
