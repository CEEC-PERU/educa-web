import React from 'react';
import Link from 'next/link';

interface ButtonProps {
  buttonLabel: string;
  buttonroute?:string;
  responsiveButtonSize ? : string;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: string;
  buttonSize?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  navigateTo?: string; // Nueva prop para manejar la navegación
}

const ButtonComponent: React.FC<ButtonProps> = ({ 
  
  buttonLabel = "Detalles", 
  buttonroute = "/login",
  backgroundColor = "bg-gray-900", 
  textColor = "text-white", 
  responsiveButtonSize =  "sm:py-2.5 sm:px-6 md:py-3 md:px-8 lg:py-3.5 lg:px-10",
  fontSize = "text-sm", 
  buttonSize = "py-3.5 px-7",
  onClick,
  navigateTo // Nueva prop
}) => {
  

 
  const buttonClasses = `block w-full select-none rounded-full ${backgroundColor} ${textColor} ${fontSize} ${buttonSize} ${responsiveButtonSize} font-bold uppercase shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-85 focus:shadow-none active:opacity-85 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`;
  
  return (
    <Link href={buttonroute}>
    <button className={buttonClasses} type="button" >
      {buttonLabel}
    </button>
    </Link>
  );
};

export default ButtonComponent;
