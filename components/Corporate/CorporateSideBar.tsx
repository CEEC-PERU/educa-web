import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  BookOpenIcon,
  TagIcon,
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import { LogoutIcon } from "../icons/LogoutIcon";
import { Profile } from "../../interfaces/User/UserInterfaces";
import { getAllRequirements } from "../../services/requirementService";

interface SidebarCorporateProps {
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarCorporate: React.FC<SidebarCorporateProps> = ({
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

  let name = "";
  let uri_picture = "";
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
        console.error("Error fetching requirements:", error);
      }
    };

    fetchRequirements();
  }, []);

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
          isOpen ? "w-64" : "w-16"
        }`}
        style={{ transition: "width 0.3s" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <nav className="flex-1">
          <ul>
            <li>
              <button
                onClick={() => handleNavigation("/corporate/")}
                className={"relative flex items-center h-[52px] w-full mb-2 rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 border px-4 " + (isActivePath("/corporate/", true) ? "bg-gradient-to-r from-[#5E168C] to-[#8E24AA] text-white shadow-[0_4px_20px_rgba(142,36,170,0.4)] border-white/30" : "bg-[#1A0630] text-gray-400 hover:bg-[#2D0B4A] hover:text-white border-white/10")}
              >                {isActivePath("/corporate/", true) && (
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
                <BookOpenIcon className="h-6 w-6 relative z-10" />
                {isOpen && <span className="ml-2 relative z-10">Dashboard</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation("/corporate/usuarios")}
                className={"relative flex items-center h-[52px] w-full mb-2 rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 border px-4 " + (isActivePath("/corporate/usuarios") ? "bg-gradient-to-r from-[#5E168C] to-[#8E24AA] text-white shadow-[0_4px_20px_rgba(142,36,170,0.4)] border-white/30" : "bg-[#1A0630] text-gray-400 hover:bg-[#2D0B4A] hover:text-white border-white/10")}
              >                {isActivePath("/corporate/usuarios") && (
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
                onClick={() => handleNavigation("/corporate/classroom")}
                className={"relative flex items-center h-[52px] w-full mb-2 rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 border px-4 " + (isActivePath("/corporate/classroom") ? "bg-gradient-to-r from-[#5E168C] to-[#8E24AA] text-white shadow-[0_4px_20px_rgba(142,36,170,0.4)] border-white/30" : "bg-[#1A0630] text-gray-400 hover:bg-[#2D0B4A] hover:text-white border-white/10")}
              >                {isActivePath("/corporate/classroom") && (
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
                {isOpen && <span className="ml-2 relative z-10">Classroom</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation("/corporate/courses")}
                className={"relative flex items-center h-[52px] w-full mb-2 rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 border px-4 " + (isActivePath("/corporate/courses") ? "bg-gradient-to-r from-[#5E168C] to-[#8E24AA] text-white shadow-[0_4px_20px_rgba(142,36,170,0.4)] border-white/30" : "bg-[#1A0630] text-gray-400 hover:bg-[#2D0B4A] hover:text-white border-white/10")}
              >                {isActivePath("/corporate/courses") && (
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
                <BookOpenIcon className="h-6 w-6 relative z-10" />
                {isOpen && <span className="ml-2 relative z-10">Cursos</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation("/corporate/certificates")}
                className={"relative flex items-center h-[52px] w-full mb-2 rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 border px-4 " + (isActivePath("/corporate/certificates") ? "bg-gradient-to-r from-[#5E168C] to-[#8E24AA] text-white shadow-[0_4px_20px_rgba(142,36,170,0.4)] border-white/30" : "bg-[#1A0630] text-gray-400 hover:bg-[#2D0B4A] hover:text-white border-white/10")}
              >                {isActivePath("/corporate/certificates") && (
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
                <TagIcon className="h-6 w-6 relative z-10" />
                {isOpen && <span className="ml-2 relative z-10">Certificaciones</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() =>
                  handleNavigation("/corporate/qualification/progress")
                }
                className={"relative flex items-center h-[52px] w-full mb-2 rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 border px-4 " + (isActivePath("/corporate/qualification/progress") ? "bg-gradient-to-r from-[#5E168C] to-[#8E24AA] text-white shadow-[0_4px_20px_rgba(142,36,170,0.4)] border-white/30" : "bg-[#1A0630] text-gray-400 hover:bg-[#2D0B4A] hover:text-white border-white/10")}
              >                {isActivePath("/corporate/qualification/progress") && (
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
                {isOpen && <span className="ml-2 relative z-10">Detalle Estudiante</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation("/corporate/sesion")}
                className={"relative flex items-center h-[52px] w-full mb-2 rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 border px-4 " + (isActivePath("/corporate/sesion") ? "bg-gradient-to-r from-[#5E168C] to-[#8E24AA] text-white shadow-[0_4px_20px_rgba(142,36,170,0.4)] border-white/30" : "bg-[#1A0630] text-gray-400 hover:bg-[#2D0B4A] hover:text-white border-white/10")}
              >                {isActivePath("/corporate/sesion") && (
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
                <ClockIcon className="h-6 w-6 relative z-10" />
                {isOpen && <span className="ml-2 relative z-10">Sesiones</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation("/corporate/addRequeriment")}
                className={"relative flex items-center h-[52px] w-full mb-2 rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 border px-4 " + (isActivePath("/corporate/addRequeriment") ? "bg-gradient-to-r from-[#5E168C] to-[#8E24AA] text-white shadow-[0_4px_20px_rgba(142,36,170,0.4)] border-white/30" : "bg-[#1A0630] text-gray-400 hover:bg-[#2D0B4A] hover:text-white border-white/10")}
              >                {isActivePath("/corporate/addRequeriment") && (
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
                {isOpen && <span className="ml-2 relative z-10">Nuevo Requerimiento</span>}
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

export default SidebarCorporate;
