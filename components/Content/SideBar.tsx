import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { BookOpenIcon, TagIcon, UserGroupIcon, CubeIcon, DocumentTextIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';

import { useAuth } from '../../context/AuthContext';
import { Profile } from '../../interfaces/UserInterfaces';

interface SidebarProps {
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ showSidebar, setShowSidebar }) => {
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
    <div className="fixed h-96 z-50">
      <div
        className={`bg-gradient-to-r h-dvh rounded-r-lg bg-brandmorado-700 text-white transition-all transform ${
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
                onClick={() => handleNavigation('/content')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <BookOpenIcon className="h-6 w-6" />
                {isOpen && <span className="ml-2">Cursos</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/content/category')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <TagIcon className="h-6 w-6" />
                {isOpen && <span className="ml-2">Categorias</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/content/professors')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <UserGroupIcon className="h-6 w-6" />
                {isOpen && <span className="ml-2">Profesores</span>}
              </button>
            </li>
              <li>
              <button
                onClick={() => handleNavigation('/content/module')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <CubeIcon className="h-6 w-6" />
                {isOpen && <span className="ml-2">Módulos</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/content/evaluation')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <DocumentTextIcon  className="h-6 w-6" />
                {isOpen && <span className="ml-2">Evaluaciones</span>}
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


export default Sidebar;
