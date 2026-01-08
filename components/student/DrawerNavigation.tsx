import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  HomeIcon,
  ArrowRightStartOnRectangleIcon,
  ComputerDesktopIcon,
  PuzzlePieceIcon,
  DocumentIcon,
  DocumentArrowUpIcon,
} from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext';
import { Profile } from '../../interfaces/User/UserInterfaces';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const DrawerNavigation: React.FC<{
  isDrawerOpen: boolean;
  toggleSidebar: () => void;
}> = ({ isDrawerOpen, toggleSidebar }) => {
  const router = useRouter();
  const { logout, profileInfo } = useAuth();
  const [isCursosOpen, setIsCursosOpen] = useState(false);

  const toggleCursosDropdown = () => {
    setIsCursosOpen(!isCursosOpen);
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
    toggleSidebar(); // Close the drawer after navigation
  };

  return (
    <div
      className={`fixed left-0 top-16 h-full z-50 transition-transform transform ${
        isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:w-64`}
    >
      <div
        className={`bg-brandmorado-700 h-full rounded-r-lg text-white transition-width transform ${
          isDrawerOpen ? 'w-64' : 'w-16'
        }`}
      >
        <nav className="flex-1">
          <ul>
            <li>
              <button
                onClick={() => handleNavigation('/student')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <HomeIcon className="h-6 w-6" />
                {isDrawerOpen && <span className="ml-2">Home</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/student/profile')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <img
                  src={uri_picture}
                  alt="Profile"
                  className="h-6 w-6 rounded-full"
                />
                {isDrawerOpen && <span className="ml-2">{name}</span>}
              </button>
            </li>
            <li>
              <button
                onClick={
                  isDrawerOpen
                    ? toggleCursosDropdown
                    : () => handleNavigation('/student/cursos')
                }
                className="flex items-center justify-between p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <div className="flex items-center">
                  <ComputerDesktopIcon className="h-6 w-6" />
                  {isDrawerOpen && <span className="ml-2">Cursos</span>}
                </div>
                {isDrawerOpen &&
                  (isCursosOpen ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  ))}
              </button>
              {isDrawerOpen && isCursosOpen && (
                <ul className="bg-brandmorado-800">
                  <li>
                    <button
                      onClick={() =>
                        handleNavigation('/student/contenido-adicional')
                      }
                      className="flex items-center p-3 pl-12 text-white hover:bg-brand-200 w-full text-left text-sm"
                    >
                      Contenido adicional
                    </button>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/student/evaluaciones')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <DocumentArrowUpIcon className="h-6 w-6" />
                {isDrawerOpen && <span className="ml-2">Evaluaciones</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/student/certificaciones')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <DocumentIcon className="h-6 w-6" />
                {isDrawerOpen && <span className="ml-2">Certificaciones</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/student/notas')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <DocumentIcon className="h-6 w-6" />
                {isDrawerOpen && <span className="ml-2">Notas</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/student/diplomas')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <DocumentArrowUpIcon className="h-6 w-6" />
                {isDrawerOpen && <span className="ml-2">Mis Diplomas</span>}
              </button>
            </li>

            <li>
              <button
                onClick={() => handleNavigation('/student/juegos')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <PuzzlePieceIcon className="h-6 w-6" />
                {isDrawerOpen && (
                  <span className="ml-2">Juegos Didácticos</span>
                )}
              </button>
            </li>
            <li>
              <button
                onClick={logout}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <ArrowRightStartOnRectangleIcon className="h-6 w-6" />
                {isDrawerOpen && <span className="ml-2">Cerrar Sesión</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default DrawerNavigation;
