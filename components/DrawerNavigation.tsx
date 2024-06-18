import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { HomeIcon, UserIcon , ArrowRightStartOnRectangleIcon , ComputerDesktopIcon} from '@heroicons/react/24/solid'; // Importar íconos
import { useAuth } from '../context/AuthContext';
import { Profile } from '../interfaces/UserInterfaces';
const DrawerNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { logout, user, profileInfo } = useAuth();
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  
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

  return (
    <div className="fixed h-96 z-50">
      <div
        className={`bg-gradient-to-r h-dvh rounded-r-lg bg-brandmorado-700  text-white transition-transform transform ${
          isOpen ? 'w-64' : 'w-16'
        }`}
        style={{ transition: 'width 0.3s' }}
      >
        <button className="p-4 focus:outline-none" onClick={handleToggle}>
          {isOpen ? 'Close' : 'Menu'}
        </button>
        <nav className={`flex-1 ${isOpen ? 'block' : 'hidden'}`}>
          <ul>
            <li>
              <button
                onClick={() => handleNavigation('/student')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <HomeIcon className="h-6 w-6 mr-2" />
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/student')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <ComputerDesktopIcon className="h-6 w-6 mr-2" />
                Cursos
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/student/profile')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
            <img src={uri_picture} alt="Profile" className="h-6 w-6 mr-2 rounded-full " />
            {name}

              </button>
            </li>
            <li>
              <button
                 onClick={logout}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <ArrowRightStartOnRectangleIcon className="h-6 w-6 mr-2" />
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default DrawerNavigation;
