import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  AcademicCapIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  BuildingOfficeIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { LogoutIcon } from "../icons/LogoutIcon";
import { Profile } from '../../interfaces/User/UserInterfaces';
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
  const isActivePath = (path: string, exact = false) => {
    const currentPath = router.pathname.replace(/\/+$/, "") || "/";
    const targetPath = path.replace(/\/+$/, "") || "/";
    return currentPath === targetPath || (!exact && currentPath.startsWith(`${targetPath}/`));
  };
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

    // Escucha un evento personalizado para la actualizaciÃƒÂ³n de los requerimientos
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
    setIsOpen(false); // Cerrar el drawer despuÃƒÂ©s de la navegaciÃƒÂ³n
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
                className={"relative flex items-center h-[52px] w-full mb-2 rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 border px-4 " + (isActivePath("/admin", true) ? "bg-gradient-to-r from-[#5E168C] to-[#8E24AA] text-white shadow-[0_4px_20px_rgba(142,36,170,0.4)] border-white/30" : "bg-[#1A0630] text-gray-400 hover:bg-[#2D0B4A] hover:text-white border-white/10")}
              >                {isActivePath("/admin", true) && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="waveGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                        <stop offset="60%" stopColor="rgba(255,255,255,0.15)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
                      </linearGradient>
                    </defs>
                    <path d="M 65,0 C 30,40 90,60 100,100 L 100,0 Z" fill="url(#waveGradient)" />
                  </svg>
                )}
                <AcademicCapIcon className="h-6 w-6 relative z-10" />
                {isOpen && <span className="ml-2 relative z-10">Estudiantes</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/admin/user-enterprise')}
                className={"relative flex items-center h-[52px] w-full mb-2 rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 border px-4 " + (isActivePath("/admin/user-enterprise") ? "bg-gradient-to-r from-[#5E168C] to-[#8E24AA] text-white shadow-[0_4px_20px_rgba(142,36,170,0.4)] border-white/30" : "bg-[#1A0630] text-gray-400 hover:bg-[#2D0B4A] hover:text-white border-white/10")}
              >                {isActivePath("/admin/user-enterprise") && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="waveGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                        <stop offset="60%" stopColor="rgba(255,255,255,0.15)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
                      </linearGradient>
                    </defs>
                    <path d="M 65,0 C 30,40 90,60 100,100 L 100,0 Z" fill="url(#waveGradient)" />
                  </svg>
                )}
                <BuildingOfficeIcon className="h-6 w-6 relative z-10" />
                {isOpen && <span className="ml-2 relative z-10">Empresas</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/admin/users')}
                className={"relative flex items-center h-[52px] w-full mb-2 rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 border px-4 " + (isActivePath("/admin/users") ? "bg-gradient-to-r from-[#5E168C] to-[#8E24AA] text-white shadow-[0_4px_20px_rgba(142,36,170,0.4)] border-white/30" : "bg-[#1A0630] text-gray-400 hover:bg-[#2D0B4A] hover:text-white border-white/10")}
              >                {isActivePath("/admin/users") && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="waveGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                        <stop offset="60%" stopColor="rgba(255,255,255,0.15)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
                      </linearGradient>
                    </defs>
                    <path d="M 65,0 C 30,40 90,60 100,100 L 100,0 Z" fill="url(#waveGradient)" />
                  </svg>
                )}
                <UserGroupIcon className="h-6 w-6 relative z-10" />
                {isOpen && <span className="ml-2 relative z-10">Usuarios</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/admin/requirements')}
                className={"relative flex items-center h-[52px] w-full mb-2 rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 border px-4 " + (isActivePath("/admin/requirements") ? "bg-gradient-to-r from-[#5E168C] to-[#8E24AA] text-white shadow-[0_4px_20px_rgba(142,36,170,0.4)] border-white/30" : "bg-[#1A0630] text-gray-400 hover:bg-[#2D0B4A] hover:text-white border-white/10")}
              >                {isActivePath("/admin/requirements") && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="waveGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                        <stop offset="60%" stopColor="rgba(255,255,255,0.15)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
                      </linearGradient>
                    </defs>
                    <path d="M 65,0 C 30,40 90,60 100,100 L 100,0 Z" fill="url(#waveGradient)" />
                  </svg>
                )}
                <ClipboardDocumentCheckIcon className="h-6 w-6 relative z-10" />
                {isOpen && <span className="ml-2 relative z-10">Requerimientos</span>}
                {requirements.length > 0 && (
                  <span className="absolute right-4 top-2 z-10 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
                className={"relative flex items-center h-[52px] w-full mb-2 rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 border px-4 " + (isActivePath("/admin/student/AssignStudents") ? "bg-gradient-to-r from-[#5E168C] to-[#8E24AA] text-white shadow-[0_4px_20px_rgba(142,36,170,0.4)] border-white/30" : "bg-[#1A0630] text-gray-400 hover:bg-[#2D0B4A] hover:text-white border-white/10")}
              >                {isActivePath("/admin/student/AssignStudents") && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="waveGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                        <stop offset="60%" stopColor="rgba(255,255,255,0.15)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
                      </linearGradient>
                    </defs>
                    <path d="M 65,0 C 30,40 90,60 100,100 L 100,0 Z" fill="url(#waveGradient)" />
                  </svg>
                )}
                <UserPlusIcon className="h-6 w-6 relative z-10" />
                {isOpen && <span className="ml-2 relative z-10">AsignaciÃƒÂ³n de Cursos</span>}
              </button>
            </li>
            <li>
              <button
                onClick={logout}
                className="relative flex items-center h-[52px] w-full mb-2 rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 border px-4 bg-[#1A0630] text-gray-400 hover:bg-[#2D0B4A] hover:text-white border-white/10"
              >
                <LogoutIcon className="h-6 w-6 relative z-10" />
                {isOpen && <span className="ml-2 relative z-10">Cerrar SesiÃƒÂ³n</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SidebarAdmin;
