import React from 'react';

interface ButtonProps {
  buttonLabel: string;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: string;
  buttonSize?: string;
  onClick?:  (e: React.MouseEvent<HTMLButtonElement>) => void;  // Añadido onClick
}

const ButtonComponent: React.FC<ButtonProps> = ({ 
  buttonLabel = "Detalles", 
  backgroundColor = "bg-gray-900", 
  textColor = "text-white", 
  fontSize = "text-sm", 
  buttonSize = "py-3.5 px-7",
  onClick  // Añadido onClick
}) => {
  const buttonClasses = `block w-full select-none rounded-xl ${backgroundColor} ${buttonSize} ${textColor} font-bold uppercase shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`;
  
  return (
    <button className={buttonClasses} type="button" onClick={onClick}>
      {buttonLabel}
    </button>
  );
};

export default ButtonComponent;
