import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  AcademicCapIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  BuildingOfficeIcon,
  ArrowRightStartOnRectangleIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { Profile } from '../../interfaces/UserInterfaces';
import { getAllRequirementsbar } from '../../services/requirementService';

interface SidebarAdminProps {
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarAdmin: React.FC<SidebarAdminProps> = ({
  showSidebar,
  setShowSidebar,
}) => {
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
        const data = await getAllRequirementsbar();
        setRequirements(data);
      } catch (error) {
        console.error('Error fetching requirements:', error);
      }
    };

    fetchRequirements();
  }, []);

  useEffect(() => {
    const handleRequirementUpdate = () => {
      fetchRequirements();
    };

    // Escucha un evento personalizado para la actualización de los requerimientos
    window.addEventListener('requirementUpdate', handleRequirementUpdate);

    return () => {
      window.removeEventListener('requirementUpdate', handleRequirementUpdate);
    };
  }, []);

  const fetchRequirements = async () => {
    try {
      const data = await getAllRequirementsbar();
      setRequirements(data);
    } catch (error) {
      console.error('Error fetching requirements:', error);
    }
  };

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
                onClick={() => handleNavigation('/admin')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <AcademicCapIcon className="h-6 w-6" />
                {isOpen && <span className="ml-2">Estudiantes</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/admin/user-enterprise')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <BuildingOfficeIcon className="h-6 w-6" />
                {isOpen && <span className="ml-2">Empresas</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/admin/users')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <UserGroupIcon className="h-6 w-6" />
                {isOpen && <span className="ml-2">Usuarios</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/admin/requirements')}
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left relative"
              >
                <ClipboardDocumentCheckIcon className="h-6 w-6" />
                {isOpen && <span className="ml-2">Requerimientos</span>}
                {requirements.length > 0 && (
                  <span className="absolute right-4 top-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {requirements.length}
                  </span>
                )}
              </button>
            </li>
            <li>
              <button
                onClick={() =>
                  handleNavigation('/admin/student/AssignStudents')
                }
                className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                <UserPlusIcon className="h-6 w-6" />
                {isOpen && <span className="ml-2">Asignación de Cursos</span>}
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

export default SidebarAdmin;
