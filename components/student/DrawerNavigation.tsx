import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { HomeIcon, UserIcon, ArrowRightStartOnRectangleIcon, ComputerDesktopIcon } from '@heroicons/react/24/solid'; // Importar íconos
import { useAuth } from '../../context/AuthContext';
import { Profile } from '../../interfaces/UserInterfaces';

const DrawerNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { logout, profileInfo } = useAuth();

  let name = '';
  let uri_picture = '';
  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    uri_picture = profile.profile_picture!;
  }

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsOpen(false); // Cerrar el drawer después de la navegación
  };

  const handleMouseEnter = () => {
    setIsOpen(true); // Abrir el drawer al pasar el mouse sobre los iconos
  };

  const handleMouseLeave = () => {
    setIsOpen(false); // Cerrar el drawer al sacar el mouse de los iconos
  };

  return (
    <div className="fixed left-0 top-16 h-full z-50">
      <div
        className={`bg-brandmorado-700  h-full rounded-r-lg text-white transition-all transform ${
          isOpen ? 'w-64' : 'w-16'
        }`}
        style={{ transition: 'width 0.3s' }}
        onMouseEnter={handleMouseEnter} // Abrir el drawer al pasar el mouse sobre el área del drawer
        onMouseLeave={handleMouseLeave} // Cerrar el drawer al sacar el mouse del área del drawer
      >
        <nav className="flex-1">
          <ul>
            <li>
              <button
                onClick={() => handleNavigation('/student')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <HomeIcon className="h-6 w-6" />
                {isOpen && <span className="ml-2">Home</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/student')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <ComputerDesktopIcon className="h-6 w-6" />
                {isOpen && <span className="ml-2">Cursos</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/student/profile')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <img src={uri_picture} alt="Profile" className="h-6 w-6 rounded-full" />
                {isOpen && <span className="ml-2">{name}</span>}
              </button>
            </li>
            <li>
              <button
                onClick={logout}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <ArrowRightStartOnRectangleIcon className="h-6 w-6" />
                {isOpen && <span className="ml-2">Cerrar Sesión</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default DrawerNavigation;
