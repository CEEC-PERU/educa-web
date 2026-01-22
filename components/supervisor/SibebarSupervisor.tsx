import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  BookOpenIcon,
  TagIcon,
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  ArrowRightStartOnRectangleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { IoIosArrowDown } from 'react-icons/io';
import { useAuth } from '../../context/AuthContext';
import { Profile } from '../../interfaces/User/UserInterfaces';
import { getAllRequirements } from '../../services/requirementService';

interface SidebarSupervisorProps {
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarSupervisor: React.FC<SidebarSupervisorProps> = ({
  showSidebar,
  setShowSidebar,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [requirements, setRequirements] = useState([]);
  const router = useRouter();
  const { logout, profileInfo } = useAuth();
  const [isCapacitacionesOpen, setIsCapacitacionesOpen] = useState(false);

  const toggleCapacitacionesDropwdown = () => {
    setIsCapacitacionesOpen(!isCapacitacionesOpen);
  };

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
                onClick={() => handleNavigation('/supervisor/')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <BookOpenIcon className="h-6 w-6" />
                {isOpen && <span className="ml-2">Dashboard</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/supervisor/usuarios')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <UserGroupIcon className="h-6 w-6" />
                {isOpen && <span className="ml-2">Usuarios</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/supervisor/classrooms')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <UserGroupIcon className="h-6 w-6" />
                {isOpen && <span className="ml-2">Classroom</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/supervisor/courses')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <BookOpenIcon className="h-6 w-6" />
                {isOpen && <span className="ml-2">Cursos</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/supervisor/evaluations')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <BookOpenIcon className="h-6 w-6" />
                {isOpen && <span className="ml-2">Evaluaciones</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/supervisor/sesion')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <ClockIcon className="h-6 w-6" />
                {isOpen && <span className="ml-2">Sesiones</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/supervisor/certificates')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <AcademicCapIcon className="h-6 w-6" />
                {isOpen && <span className="ml-2">Certificados</span>}
              </button>
            </li>
            {/*
            <li>
              <button
                onClick={() => handleNavigation('/supervisor/trainings')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <TagIcon className="h-6 w-6" />
                {isOpen && <span className="ml-2">Programas de Formación</span>}
              </button>
            </li>*/}
            <li>
              {/* dropdown de capacitaiones */}
              <button
                onClick={toggleCapacitacionesDropwdown}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <TagIcon className="h-6 w-6" />
                {isOpen && (
                  <span className="ml-2">
                    Programas de Formación
                    <IoIosArrowDown className="inline ml-1 h-2 w-2" />
                  </span>
                )}
              </button>
              {isCapacitacionesOpen && (
                <ul className="bg-blue-500">
                  <li>
                    <button
                      onClick={() => handleNavigation('/supervisor/trainings')}
                      className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
                    >
                      {isOpen && <span className="ml-2">Programas</span>}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() =>
                        handleNavigation('/supervisor/trainings/assignments')
                      }
                      className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
                    >
                      {isOpen && <span className="ml-2">Asignaciones</span>}
                    </button>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/supervisor/materials')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <ClipboardDocumentCheckIcon className="h-6 w-6" />
                {isOpen && <span className="ml-2">Material</span>}
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

export default SidebarSupervisor;
