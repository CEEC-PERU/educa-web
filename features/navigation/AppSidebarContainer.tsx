import React from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import { useNavigationStore } from "./navigation.store";
import { getSidebarConfigByRole } from "./sidebar.registry";
import AppSidebar from "../../components/navigation/AppSidebar";
import type { Profile } from "../../interfaces/User/UserInterfaces";
import { useEnterpriseByIdQuery } from "../enterprises/enterprises.queries";

export default function AppSidebarContainer() {
  const router = useRouter();
  const { logout, profileInfo, user: rawUser } = useAuth();
  const { isSidebarCollapsed, toggleSidebarCollapsed, isMobileSidebarOpen, setMobileSidebarOpen } = useNavigationStore();

  const profile = profileInfo as Profile | null;
  const user = profile
    ? {
        name: profile.first_name,
        profilePicture: profile.profile_picture ?? undefined,
      }
    : undefined;

  const roleId =
    typeof rawUser === "object" && rawUser !== null ? rawUser.role : 0;
  const enterpriseId =
    roleId === 1 && typeof rawUser === "object" && rawUser !== null
      ? rawUser.enterprise_id
      : undefined;
  const { data: enterprise } = useEnterpriseByIdQuery(
    enterpriseId && enterpriseId > 0 ? enterpriseId : undefined,
  );
  const normalizedEnterpriseName = enterprise?.name
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
  const isRimacStudent = roleId === 1 && normalizedEnterpriseName === "rimac";
  const sidebarConfig = getSidebarConfigByRole(roleId);
  const items = sidebarConfig.items.filter((item) => {
    if (!isRimacStudent) return true;
    return !(
      item.id === "capacitaciones" ||
      item.id === "juegos" ||
      item.label === "Capacitaciones" ||
      item.label === "Juegos Didacticos"
    );
  });
  const { bgColor } = sidebarConfig;

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  const handleAction = (action: "logout") => {
    if (action === "logout") {
      logout();
    }
  };

  return (
    <AppSidebar
      items={items}
      isCollapsed={isSidebarCollapsed}
      isMobileOpen={isMobileSidebarOpen}
      onToggleCollapse={toggleSidebarCollapsed}
      onNavigate={handleNavigate}
      onAction={handleAction}
      onCloseMobile={() => setMobileSidebarOpen(false)}
      currentPath={router.pathname}
      bgColor={bgColor}
      user={user}
    />
  );
}
