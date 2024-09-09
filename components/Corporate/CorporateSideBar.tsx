import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { BookOpenIcon, TagIcon, AcademicCapIcon, ClipboardDocumentCheckIcon, ClockIcon, ArrowRightStartOnRectangleIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { Profile } from '../../interfaces/UserInterfaces';
import { getAllRequirements } from '../../services/requirementService';

interface SidebarCorporateProps {
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarCorporate: React.FC<SidebarCorporateProps> = ({ showSidebar, setShowSidebar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [requirements, setRequirements] = useState([]);
  const router = useRouter();
  const { logout, profileInfo } = useAuth();

  let name = '';
  let uri_picture = '';
  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    uri_picture = profile.profile_picture!;
  }

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const data = await getAllRequirements();
        setRequirements(data);
      } catch (error) {
        console.error('Error fetching requirements:', error);
      }
    };

    fetchRequirements();
  }, []);

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
        className={`bg-gradient-to-r h-dvh rounded-r-lg bg-blue-600 text-white transition-all transform ${
          isOpen ? 'w-64' : 'w-16'
        }`}
        style={{ transition: 'width 0.3s' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <nav className="flex-1">
          <ul>
            <li>
              <button
                onClick={() => handleNavigation('/corporate/')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <BookOpenIcon className="h-6 w-6" />
                {isOpen && <span className="ml-2">Dashboard</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/corporate/usuarios')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <UserGroupIcon className="h-6 w-6" />
                {isOpen && <span className="ml-2">Usuarios</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/corporate/classroom')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <UserGroupIcon className="h-6 w-6" />
                {isOpen && <span className="ml-2">Classroom</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/corporate/courses')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <BookOpenIcon className="h-6 w-6" />
                {isOpen && <span className="ml-2">Cursos</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/corporate/qualification/progress')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <AcademicCapIcon className="h-6 w-6" />
                {isOpen && <span className="ml-2">Detalle Estudiante</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/corporate/sesion')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <ClockIcon className="h-6 w-6" />
                {isOpen && <span className="ml-2">Sesiones</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/corporate/addRequeriment')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <ClipboardDocumentCheckIcon className="h-6 w-6" />
                {isOpen && <span className="ml-2">Nuevo Requerimiento</span>}
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

export default SidebarCorporate;
