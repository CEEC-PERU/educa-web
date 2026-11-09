import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import { LogoutIcon } from "../icons/LogoutIcon";
import { Profile } from "../../interfaces/User/UserInterfaces";
import { getAllRequirements } from "../../services/requirementService";

interface SidebarCorporateProps {
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarAdminCorporate: React.FC<SidebarCorporateProps> = ({
  showSidebar,
  setShowSidebar,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [requirements, setRequirements] = useState([]);
  const router = useRouter();
  const isActivePath = (path: string) => router.pathname === path || router.pathname.startsWith(path + '/');
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
          isOpen ? "w-64" : "w-16"
        }`}
        style={{ transition: "width 0.3s" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <nav className="flex-1">
          <ul>
            <li>
              <button data-active={isActivePath("/admincorporative")} onClick={() => handleNavigation("/admincorporative/")}
                className={"relative flex items-center h-[56px] w-full mb-2 rounded-2xl overflow-hidden group cursor-pointer border transition-all duration-300 " + (isActivePath("/admincorporative") ? "bg-[#7435c0] text-white border-transparent" : "bg-[#1A0630] text-gray-400 hover:bg-[#2D0B4A] hover:text-white border-white/10")}
              >{isActivePath("/admincorporative") && <svg className="absolute inset-0 h-full w-full pointer-events-none z-0" preserveAspectRatio="none" viewBox="0 0 100 100"><path d="M 80,0 C 70,5 66,70 58,100 L 100,100 L 100,0 Z" fill="#5b27ad" /></svg>}<div className={isOpen ? "relative z-10 flex w-full items-center px-5" : "relative z-10 flex w-full items-center justify-center px-0"}><div className={"flex items-center justify-center w-[38px] h-[38px] rounded-lg shrink-0 transition-colors " + (isOpen ? "mr-3 " : "mr-0 ") + (isActivePath("/admincorporative") ? "bg-white/15" : "bg-[#2D0B4A]")}><BookOpenIcon className="h-[20px] w-[20px]" /></div>
                {isOpen && <span className={"text-[15px] font-medium transition-colors truncate flex-1 " + (isActivePath("/admincorporative") ? "text-white" : "text-gray-400 group-hover:text-white")}>Dashboard</span>} {isOpen && <svg className={"ml-auto h-5 w-5 transition-transform group-hover:translate-x-1 " + (isActivePath("/admincorporative") ? "text-white/80" : "text-gray-600 group-hover:text-white")} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}</div></button>
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

export default SidebarAdminCorporate;
