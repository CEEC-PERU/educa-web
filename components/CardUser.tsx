import React from 'react';
import ButtonComponent from './ButtonDelete';

interface CardProps {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>; // Tipo correcto para un icono
  title: string;
  buttonLabel: string;
  onButtonClick: () => void;
}

const CardUser: React.FC<CardProps> = ({ Icon, title, buttonLabel, onButtonClick }) => {
  return (
    <div className="relative flex flex-col w-full max-w-sm sm:max-w-md rounded-xl bg-gray-200 bg-clip-border text-gray-700 shadow-lg mx-2 my-4">
      <div className="flex justify-center items-center h-48 bg-gray-100">
        <Icon className="w-24 h-24 text-blue-500" />
      </div>
      <div className="p-5">
        <h6 className="mb-4 mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h6>
        <div className="pt-4 flex justify-center">
          <ButtonComponent
            buttonLabel={buttonLabel}
            backgroundColor="bg-gradient-to-r from-blue-500 to-blue-400"
            textColor="text-white"
            fontSize="text-sm"
            buttonSize="px-7 py-2"
            onClick={onButtonClick}
          />
        </div>
      </div>
    </div>
  );
};

export default CardUser;
