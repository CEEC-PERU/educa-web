import React from 'react';
import ButtonComponent from "../ButtonComponent";

interface CardImageProps {
  rating?: number;
  usuarios?: string;
  description?: string;
  imageUrl?: string;
  title?: string;
  name?: string;
  background? : string;
  description_short?: string;
  duration_course?: string;
  buttonLabel?: string;
  textColor?: string;
  image?: string;
  textColorDescription?:String;
  id?: number; // Hacer el id opcional
  isCircular?: boolean; // Nueva prop opcional
  onButtonClick?: (id?: number) => void; // Nueva prop para manejar el clic del botón
}

const CardImage: React.FC<CardImageProps> = ({
  usuarios = '120 usuarios',
  imageUrl = 'https://via.placeholder.com/150',
  title = 'Nombre del curso',
  rating = 0,
  description = 'Descripción corta del curso',
  buttonLabel = 'Ver detalles',
  textColor = 'text-gray-900',
  background= ' bg-violet-200',
  textColorDescription = '  text-gray-700',
  id,
  name,
  description_short,
  image,
  duration_course,
  isCircular = false, // Valor por defecto
  onButtonClick // Nueva prop para manejar el clic del botón
}) => {
  const displayName = name || title;
  const displayDescription = description_short || description;
  const displayImage = image || imageUrl;

  return (
    <div className={`relative flex flex-col w-full max-w-sm sm:max-w-md lg:max-w-lg ${background} rounded-xl bg-clip-border text-gray-700 shadow-lg mx-2 my-4`}>
      <div className={`relative mx-4 mt-4 overflow-hidden text-white shadow-lg ${isCircular ? 'rounded-full' : 'rounded-xl'} bg-blue-gray-500 bg-clip-border shadow-blue-gray-500/40`}>
        <img
          src={displayImage}
          alt={displayName}
          className={`w-full h-48 object-cover ${isCircular ? 'rounded-full' : ''}`}
        />
         
        <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-transparent to-black/60">
        </div>
        <button
          className="!absolute top-4 right-4 h-8 max-h-[32px] w-8 max-w-[32px] select-none rounded-full text-center align-middle font-sans text-xs font-medium uppercase text-red-500 transition-all hover:bg-red-500/10 active:bg-red-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
        </button>
      </div>
      <div className="p-4">
      <img
          src="https://res.cloudinary.com/dk2red18f/image/upload/v1724344210/WEB_EDUCA/wcetlngqtjvr13hrc0l6.png"
          className={` h-3  justify-left mb-5 `}
        />
         <div className=" flex justify-center">
          <ButtonComponent 
            buttonLabel={` ${buttonLabel}`}
            backgroundColor="bg-blue-700" 
            textColor="text-white" 
            fontSize="text-xs" 
            buttonSize="p-2"
            onClick={() => onButtonClick && onButtonClick(id)}
            navigateTo="/login" // Nueva prop para navegación
          />
        </div>
        <div className="flex items-center justify-center mb-3 pt-4">
          
        
            {/* Título */}
            <h5 className={`block font-sans text-xl text-center antialiased font-bold leading-snug tracking-normal ${textColor} truncate`}>
            {displayName}
          </h5>
        </div>
    
        

        {/* Usuarios */}
        <p className="text-sm text-gray-500 mb-2">
          👥 {usuarios}
        </p>
        <p className="flex justify-center items-center gap-1.5 font-sans text-base font-normal leading-relaxed text-blue-gray-900 antialiased">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="-mt-0.5 h-5 w-5 text-yellow-700">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd"></path>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="-mt-0.5 h-5 w-5 text-yellow-700">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd"></path>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="-mt-0.5 h-5 w-5 text-yellow-700">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd"></path>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="-mt-0.5 h-5 w-5 text-yellow-700">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd"></path>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="-mt-0.5 h-5 w-5 text-yellow-700">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd"></path>
            </svg>
           
          </p>
      </div>
    </div>
  );
};

export default CardImage;
