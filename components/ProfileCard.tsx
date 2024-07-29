import React, { useState } from 'react';
import ButtonComponent from './ButtonComponent';

interface ProfileCardProps {
  name: string;
  title: string;
  level: string; // Añadido campo de nivel
  imageUrl: string;
  onViewProfile: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  title,
  level,
  imageUrl,
  onViewProfile,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="w-full max-w-sm bg-violet-200 border border-gray-200 rounded-lg shadow-md text-gray-700 transition duration-300 ease-in-out transform hover:scale-105">
      <div className="flex justify-end px-4 pt-4">
        <button
          onClick={toggleDropdown}
          className="inline-block text-gray-500 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg text-sm p-1.5"
          type="button"
        >
          <span className="sr-only">Open dropdown</span>
        </button>
      </div>
      <div className="flex flex-col items-center pb-10">
        <div className="relative w-24 h-24 mb-3 rounded-full shadow-lg overflow-hidden">
          <img className="w-full h-full" src={imageUrl} alt={`${name} image`} />
          <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-transparent to-black/60"></div>
        </div>
        <h5 className="mb-1 text-xl font-medium text-gray-900">{name}</h5>
        <span className="text-sm text-gray-500">{title}</span>
        <span className="text-sm text-gray-500">Nivel: {level}</span> {/* Añadir nivel */}
        <div className="mt-4">
          <ButtonComponent
            buttonLabel="Ver Perfil"
            backgroundColor="bg-gradient-blue"
            textColor="text-white"
            fontSize="text-sm"
            buttonSize="py-2 px-6"
            onClick={onViewProfile}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
