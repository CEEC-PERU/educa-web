import React from "react";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../../context/AuthContext";
import { Profile } from "../../interfaces/User/UserInterfaces";
import UserMenu from "./UserMenu";

const DASHBOARD_BY_ROLE: Record<number, string> = {
  1: "/student",
  2: "/corporate",
  3: "/content",
  4: "/admin",
  5: "/admincorporative",
  6: "/supervisor",
  7: "/calidad",
  8: "/comercial",
};

type AppNavbarProps = {
  onToggleSidebar?: () => void;
  showMenuButton?: boolean;
  title?: string;
  bgColor?: string;
};

export default function AppNavbar({
  onToggleSidebar,
  showMenuButton = true,
  title,
  bgColor = "bg-navbar-primary",
}: AppNavbarProps) {
  const { user, profileInfo, logout } = useAuth();

  const role = typeof user === "object" && user !== null ? user.role : null;
  const dashboardHref = role !== null ? (DASHBOARD_BY_ROLE[role] ?? "/") : "/";

  return (
    <nav
      role="navigation"
      aria-label="Navegación de la aplicación"
      className={`${bgColor} h-16 fixed top-0 left-0 w-full z-50 border-b border-white/30`}
    >
      <div className="container mx-auto flex justify-between items-center h-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          {showMenuButton && onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="text-white p-2 lg:hidden"
              aria-label="Abrir menú lateral"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          )}

          <Link href={dashboardHref} className="flex items-center ml-2">
            <img
              src="https://res.cloudinary.com/dk2red18f/image/upload/v1724273464/WEB_EDUCA/smxqc1j66tbr0dkrxbdt.png"
              alt="EducaWeb Logo"
              className="h-8 sm:h-10"
            />
            <span className="text-white font-bold text-base sm:text-lg ml-2">
              MentorMind
            </span>
          </Link>

          {title && (
            <span className="ml-4 text-white text-sm font-medium hidden sm:block">
              {title}
            </span>
          )}
        </div>

        <UserMenu
          profileInfo={(profileInfo as Profile) ?? null}
          onLogout={logout}
        />
      </div>
    </nav>
  );
}
