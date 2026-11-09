import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  BookOpenIcon,
  TagIcon,
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { LogoutIcon } from "../icons/LogoutIcon";
import { Profile } from '../../interfaces/User/UserInterfaces';
import { getAllRequirements } from '../../services/requirementService';

interface SidebarComercialProps {
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarComercial: React.FC<SidebarComercialProps> = ({
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
    setIsOpen(false); // Cerrar el drawer despues de la navegacion
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
        className={`bg-[#130325] h-dvh rounded-r-lg text-white transition-all transform ${
          isOpen ? 'w-64' : 'w-16'
        }`}
        style={{ transition: 'width 0.3s' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <nav className="flex-1">
          <ul>
            <li>
              <button data-active={isActivePath("/comercial/", true)} onClick={() => handleNavigation('/comercial/')}
                className={"relative flex items-center h-[56px] w-full mb-2 rounded-2xl overflow-hidden group cursor-pointer border transition-all duration-300 " + (isActivePath("/comercial/", true) ? "bg-[#7435c0] text-white border-transparent" : "bg-[#1A0630] text-gray-400 hover:bg-[#2D0B4A] hover:text-white border-white/10")}
              >{isActivePath("/comercial/", true) && (
                  <svg className="absolute inset-0 h-full w-full pointer-events-none z-0" preserveAspectRatio="none" viewBox="0 0 100 100"><path d="M 80,0 C 70,5 66,70 58,100 L 100,100 L 100,0 Z" fill="#5b27ad" /></svg>
                )}<div className={isOpen ? "relative z-10 flex w-full items-center px-5" : "relative z-10 flex w-full items-center justify-center px-0"}><div className={"flex items-center justify-center w-[38px] h-[38px] rounded-lg shrink-0 transition-colors " + (isOpen ? "mr-3 " : "mr-0 ") + (isActivePath("/comercial/", true) ? "bg-white/15" : "bg-[#2D0B4A]")}><BookOpenIcon className="h-[20px] w-[20px]" /></div>
                {isOpen && <span className={"text-[15px] font-medium transition-colors truncate flex-1 " + (isActivePath("/comercial/", true) ? "text-white" : "text-gray-400 group-hover:text-white")}>Dashboard</span>} {isOpen && <svg className={"ml-auto h-5 w-5 transition-transform group-hover:translate-x-1 " + (isActivePath("/comercial/", true) ? "text-white/80" : "text-gray-600 group-hover:text-white")} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}</div></button>
            </li>
            <li>
              <button data-active={isActivePath("/comercial/usuarios")} onClick={() => handleNavigation('/comercial/usuarios')}
                className={"relative flex items-center h-[56px] w-full mb-2 rounded-2xl overflow-hidden group cursor-pointer border transition-all duration-300 " + (isActivePath("/comercial/usuarios") ? "bg-[#7435c0] text-white border-transparent" : "bg-[#1A0630] text-gray-400 hover:bg-[#2D0B4A] hover:text-white border-white/10")}
              >{isActivePath("/comercial/usuarios") && (
                  <svg className="absolute inset-0 h-full w-full pointer-events-none z-0" preserveAspectRatio="none" viewBox="0 0 100 100"><path d="M 80,0 C 70,5 66,70 58,100 L 100,100 L 100,0 Z" fill="#5b27ad" /></svg>
                )}<div className={isOpen ? "relative z-10 flex w-full items-center px-5" : "relative z-10 flex w-full items-center justify-center px-0"}><div className={"flex items-center justify-center w-[38px] h-[38px] rounded-lg shrink-0 transition-colors " + (isOpen ? "mr-3 " : "mr-0 ") + (isActivePath("/comercial/usuarios") ? "bg-white/15" : "bg-[#2D0B4A]")}><UserGroupIcon className="h-[20px] w-[20px]" /></div>
                {isOpen && <span className={"text-[15px] font-medium transition-colors truncate flex-1 " + (isActivePath("/comercial/usuarios") ? "text-white" : "text-gray-400 group-hover:text-white")}>Usuarios</span>} {isOpen && <svg className={"ml-auto h-5 w-5 transition-transform group-hover:translate-x-1 " + (isActivePath("/comercial/usuarios") ? "text-white/80" : "text-gray-600 group-hover:text-white")} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}</div></button>
            </li>
            <li>
              <button data-active={isActivePath("/comercial/classroom")} onClick={() => handleNavigation('/comercial/classroom')}
                className={"relative flex items-center h-[56px] w-full mb-2 rounded-2xl overflow-hidden group cursor-pointer border transition-all duration-300 " + (isActivePath("/comercial/classroom") ? "bg-[#7435c0] text-white border-transparent" : "bg-[#1A0630] text-gray-400 hover:bg-[#2D0B4A] hover:text-white border-white/10")}
              >{isActivePath("/comercial/classroom") && (
                  <svg className="absolute inset-0 h-full w-full pointer-events-none z-0" preserveAspectRatio="none" viewBox="0 0 100 100"><path d="M 80,0 C 70,5 66,70 58,100 L 100,100 L 100,0 Z" fill="#5b27ad" /></svg>
                )}<div className={isOpen ? "relative z-10 flex w-full items-center px-5" : "relative z-10 flex w-full items-center justify-center px-0"}><div className={"flex items-center justify-center w-[38px] h-[38px] rounded-lg shrink-0 transition-colors " + (isOpen ? "mr-3 " : "mr-0 ") + (isActivePath("/comercial/classroom") ? "bg-white/15" : "bg-[#2D0B4A]")}><UserGroupIcon className="h-[20px] w-[20px]" /></div>
                {isOpen && <span className={"text-[15px] font-medium transition-colors truncate flex-1 " + (isActivePath("/comercial/classroom") ? "text-white" : "text-gray-400 group-hover:text-white")}>Classroom</span>} {isOpen && <svg className={"ml-auto h-5 w-5 transition-transform group-hover:translate-x-1 " + (isActivePath("/comercial/classroom") ? "text-white/80" : "text-gray-600 group-hover:text-white")} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}</div></button>
            </li>
            <li>
              <button data-active={isActivePath("/comercial/courses")} onClick={() => handleNavigation('/comercial/courses')}
                className={"relative flex items-center h-[56px] w-full mb-2 rounded-2xl overflow-hidden group cursor-pointer border transition-all duration-300 " + (isActivePath("/comercial/courses") ? "bg-[#7435c0] text-white border-transparent" : "bg-[#1A0630] text-gray-400 hover:bg-[#2D0B4A] hover:text-white border-white/10")}
              >{isActivePath("/comercial/courses") && (
                  <svg className="absolute inset-0 h-full w-full pointer-events-none z-0" preserveAspectRatio="none" viewBox="0 0 100 100"><path d="M 80,0 C 70,5 66,70 58,100 L 100,100 L 100,0 Z" fill="#5b27ad" /></svg>
                )}<div className={isOpen ? "relative z-10 flex w-full items-center px-5" : "relative z-10 flex w-full items-center justify-center px-0"}><div className={"flex items-center justify-center w-[38px] h-[38px] rounded-lg shrink-0 transition-colors " + (isOpen ? "mr-3 " : "mr-0 ") + (isActivePath("/comercial/courses") ? "bg-white/15" : "bg-[#2D0B4A]")}><BookOpenIcon className="h-[20px] w-[20px]" /></div>
                {isOpen && <span className={"text-[15px] font-medium transition-colors truncate flex-1 " + (isActivePath("/comercial/courses") ? "text-white" : "text-gray-400 group-hover:text-white")}>Cursos</span>} {isOpen && <svg className={"ml-auto h-5 w-5 transition-transform group-hover:translate-x-1 " + (isActivePath("/comercial/courses") ? "text-white/80" : "text-gray-600 group-hover:text-white")} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}</div></button>
            </li>
            <li>
              <button data-active={isActivePath("/comercial/qualification/progress")} onClick={() =>
                  handleNavigation('/comercial/qualification/progress')
                }
                className={"relative flex items-center h-[56px] w-full mb-2 rounded-2xl overflow-hidden group cursor-pointer border transition-all duration-300 " + (isActivePath("/comercial/qualification/progress") ? "bg-[#7435c0] text-white border-transparent" : "bg-[#1A0630] text-gray-400 hover:bg-[#2D0B4A] hover:text-white border-white/10")}
              >{isActivePath("/comercial/qualification/progress") && (
                  <svg className="absolute inset-0 h-full w-full pointer-events-none z-0" preserveAspectRatio="none" viewBox="0 0 100 100"><path d="M 80,0 C 70,5 66,70 58,100 L 100,100 L 100,0 Z" fill="#5b27ad" /></svg>
                )}<div className={isOpen ? "relative z-10 flex w-full items-center px-5" : "relative z-10 flex w-full items-center justify-center px-0"}><div className={"flex items-center justify-center w-[38px] h-[38px] rounded-lg shrink-0 transition-colors " + (isOpen ? "mr-3 " : "mr-0 ") + (isActivePath("/comercial/qualification/progress") ? "bg-white/15" : "bg-[#2D0B4A]")}><AcademicCapIcon className="h-[20px] w-[20px]" /></div>
                {isOpen && <span className={"text-[15px] font-medium transition-colors truncate flex-1 " + (isActivePath("/comercial/qualification/progress") ? "text-white" : "text-gray-400 group-hover:text-white")}>Detalle Estudiante</span>} {isOpen && <svg className={"ml-auto h-5 w-5 transition-transform group-hover:translate-x-1 " + (isActivePath("/comercial/qualification/progress") ? "text-white/80" : "text-gray-600 group-hover:text-white")} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}</div></button>
            </li>
            <li>
              <button data-active={isActivePath("/comercial/sesion")} onClick={() => handleNavigation('/comercial/sesion')}
                className={"relative flex items-center h-[56px] w-full mb-2 rounded-2xl overflow-hidden group cursor-pointer border transition-all duration-300 " + (isActivePath("/comercial/sesion") ? "bg-[#7435c0] text-white border-transparent" : "bg-[#1A0630] text-gray-400 hover:bg-[#2D0B4A] hover:text-white border-white/10")}
              >{isActivePath("/comercial/sesion") && (
                  <svg className="absolute inset-0 h-full w-full pointer-events-none z-0" preserveAspectRatio="none" viewBox="0 0 100 100"><path d="M 80,0 C 70,5 66,70 58,100 L 100,100 L 100,0 Z" fill="#5b27ad" /></svg>
                )}<div className={isOpen ? "relative z-10 flex w-full items-center px-5" : "relative z-10 flex w-full items-center justify-center px-0"}><div className={"flex items-center justify-center w-[38px] h-[38px] rounded-lg shrink-0 transition-colors " + (isOpen ? "mr-3 " : "mr-0 ") + (isActivePath("/comercial/sesion") ? "bg-white/15" : "bg-[#2D0B4A]")}><ClockIcon className="h-[20px] w-[20px]" /></div>
                {isOpen && <span className={"text-[15px] font-medium transition-colors truncate flex-1 " + (isActivePath("/comercial/sesion") ? "text-white" : "text-gray-400 group-hover:text-white")}>Sesiones</span>} {isOpen && <svg className={"ml-auto h-5 w-5 transition-transform group-hover:translate-x-1 " + (isActivePath("/comercial/sesion") ? "text-white/80" : "text-gray-600 group-hover:text-white")} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}</div></button>
            </li>
            <li>
              <button data-active={isActivePath("/comercial/addRequeriment")} onClick={() => handleNavigation('/comercial/addRequeriment')}
                className={"relative flex items-center h-[56px] w-full mb-2 rounded-2xl overflow-hidden group cursor-pointer border transition-all duration-300 " + (isActivePath("/comercial/addRequeriment") ? "bg-[#7435c0] text-white border-transparent" : "bg-[#1A0630] text-gray-400 hover:bg-[#2D0B4A] hover:text-white border-white/10")}
              >{isActivePath("/comercial/addRequeriment") && (
                  <svg className="absolute inset-0 h-full w-full pointer-events-none z-0" preserveAspectRatio="none" viewBox="0 0 100 100"><path d="M 80,0 C 70,5 66,70 58,100 L 100,100 L 100,0 Z" fill="#5b27ad" /></svg>
                )}<div className={isOpen ? "relative z-10 flex w-full items-center px-5" : "relative z-10 flex w-full items-center justify-center px-0"}><div className={"flex items-center justify-center w-[38px] h-[38px] rounded-lg shrink-0 transition-colors " + (isOpen ? "mr-3 " : "mr-0 ") + (isActivePath("/comercial/addRequeriment") ? "bg-white/15" : "bg-[#2D0B4A]")}><ClipboardDocumentCheckIcon className="h-[20px] w-[20px]" /></div>
                {isOpen && <span className={"text-[15px] font-medium transition-colors truncate flex-1 " + (isActivePath("/comercial/addRequeriment") ? "text-white" : "text-gray-400 group-hover:text-white")}>Nuevo Requerimiento</span>} {isOpen && <svg className={"ml-auto h-5 w-5 transition-transform group-hover:translate-x-1 " + (isActivePath("/comercial/addRequeriment") ? "text-white/80" : "text-gray-600 group-hover:text-white")} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}</div></button>
            </li>
            <li>
              <button
                onClick={logout}
                className="relative flex items-center h-[56px] w-full mb-2 rounded-2xl overflow-hidden group cursor-pointer border transition-all duration-300 bg-[#1A0630] text-gray-400 hover:bg-[#2D0B4A] hover:text-white border-white/10"
              ><div className={isOpen ? "relative z-10 flex w-full items-center px-5" : "relative z-10 flex w-full items-center justify-center px-0"}><div className={"flex items-center justify-center w-[38px] h-[38px] rounded-lg shrink-0 transition-colors " + (isOpen ? "mr-3 " : "mr-0 ") + "bg-[#2D0B4A]"}><LogoutIcon className="h-[20px] w-[20px]" /></div>
                {isOpen && <span className={"text-[15px] font-medium transition-colors truncate flex-1 " + "text-gray-400 group-hover:text-white"}>Cerrar Sesion</span>} {isOpen && <svg className="ml-auto h-5 w-5 transition-transform group-hover:translate-x-1 text-gray-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}</div></button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SidebarComercial;
