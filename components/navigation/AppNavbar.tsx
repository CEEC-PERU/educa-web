import React from "react";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../../context/AuthContext";
import { Profile } from "../../interfaces/User/UserInterfaces";
import UserMenu from "./UserMenu";
import { useEnterpriseByIdQuery } from "@/features/enterprises/enterprises.queries";

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
  const enterpriseId =
    typeof user === "object" && user !== null
      ? user.enterprise_id
      : undefined;
  const { data: enterprise } = useEnterpriseByIdQuery(
    enterpriseId && enterpriseId > 0 ? enterpriseId : undefined,
  );
  const normalizedEnterpriseName = enterprise?.name
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
  const companyLogoSrc = normalizedEnterpriseName?.includes("rimac")
    ? "/logos/rimac.png"
    : enterprise?.image_log || null;
  const [companyLogoError, setCompanyLogoError] = React.useState(false);
  React.useEffect(() => setCompanyLogoError(false), [companyLogoSrc]);
  const dashboardHref = role !== null ? (DASHBOARD_BY_ROLE[role] ?? "/") : "/";

  return (
    <nav
      role="navigation"
      aria-label="Navegacion de la aplicacion"
      className={`${bgColor} h-16 fixed top-0 left-0 w-full z-50 border-b border-white/30`}
    >
      <div className="flex justify-between items-center h-full px-2 sm:px-4 lg:px-6">
        <div className="flex items-center">
          {showMenuButton && onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="text-white p-2 lg:hidden"
              aria-label="Abrir menu lateral"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          )}

          <Link href={dashboardHref} className="flex items-center">
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

        <div className="flex items-center gap-4">
          {companyLogoSrc && !companyLogoError && (
            <img
              src={companyLogoSrc}
              alt={
                enterprise?.name
                  ? `Logo de ${enterprise.name}`
                  : "Logo de la empresa"
              }
              className="h-8 max-w-28 object-contain"
              onError={() => setCompanyLogoError(true)}
            />
          )}
          <UserMenu
            profileInfo={(profileInfo as Profile) ?? null}
            onLogout={logout}
          />
        </div>
      </div>
    </nav>
  );
}
