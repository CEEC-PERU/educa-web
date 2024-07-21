import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { HomeIcon, UserIcon, ArrowRightStartOnRectangleIcon, ComputerDesktopIcon } from '@heroicons/react/24/solid'; 
import { useAuth } from '../../context/AuthContext';
import { Profile } from '../../interfaces/UserInterfaces';


const DrawerNavigation: React.FC<{ isDrawerOpen: boolean }> = ({ isDrawerOpen }) => {
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
    setIsOpen(false); // Close the drawer after navigation
  };

  const handleMouseEnter = () => {
    setIsOpen(true); // Open the drawer when the mouse enters the icons area
  };

  const handleMouseLeave = () => {
    setIsOpen(false); // Close the drawer when the mouse leaves the icons area
  };

  return (
    <div className={`fixed left-0 top-16 h-full z-50 ${isOpen ? 'lg:w-64' : 'lg:w-16'} lg:block hidden`}>
      <div
        className={`bg-brandmorado-700 h-full rounded-r-lg text-white transition-all transform ${isOpen ? 'w-64' : 'w-16'}`}
        style={{ transition: 'width 0.3s' }}
        onMouseEnter={handleMouseEnter} // Open the drawer when the mouse enters the drawer area
        onMouseLeave={handleMouseLeave} // Close the drawer when the mouse leaves the drawer area
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
                onClick={() => handleNavigation('/student/diplomas')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                  <HomeIcon className="h-6 w-6" />
                {isOpen && <span className="ml-2">Mis Diplomas</span>}
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
