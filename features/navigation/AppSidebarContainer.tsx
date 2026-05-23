import React from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import { useNavigationStore } from "./navigation.store";
import { getSidebarConfigByRole } from "./sidebar.registry";
import AppSidebar from "../../components/navigation/AppSidebar";
import type { Profile } from "../../interfaces/User/UserInterfaces";

export default function AppSidebarContainer() {
  const router = useRouter();
  const { logout, profileInfo, user: rawUser } = useAuth();
  const { isSidebarCollapsed, toggleSidebarCollapsed } = useNavigationStore();

  const profile = profileInfo as Profile | null;
  const user = profile
    ? {
        name: profile.first_name,
        profilePicture: profile.profile_picture ?? undefined,
      }
    : undefined;

  const roleId =
    typeof rawUser === "object" && rawUser !== null ? rawUser.role : 0;
  const { items } = getSidebarConfigByRole(roleId);

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
      onToggleCollapse={toggleSidebarCollapsed}
      onNavigate={handleNavigate}
      onAction={handleAction}
      currentPath={router.pathname}
      user={user}
    />
  );
}
