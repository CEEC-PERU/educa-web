import React from "react";
import type { AppSidebarItem } from "../../features/navigation/app-sidebar.types";
import { isSidebarItemActive } from "../../features/navigation/utils/isSidebarItemActive";
import AppSidebarHeader from "./AppSidebarHeader";
import AppSidebarItemComponent from "./AppSidebarItem";
import AppSidebarGroup from "./AppSidebarGroup";
import AppSidebarFooter from "./AppSidebarFooter";

export type AppSidebarProps = {
  items: AppSidebarItem[];
  isCollapsed: boolean;
  isMobileOpen?: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: (href: string) => void;
  onAction?: (action: "logout") => void;
  onCloseMobile?: () => void;
  currentPath?: string;
  variant?: "desktop" | "mobile";
  bgColor?: string;
  user?: {
    name?: string;
    profilePicture?: string;
  };
};

export default function AppSidebar({
  items,
  isCollapsed,
  isMobileOpen = false,
  onToggleCollapse,
  onNavigate,
  onAction,
  onCloseMobile,
  currentPath = "",
  bgColor = "bg-blue-600",
  user,
}: AppSidebarProps) {
  const navItems = items.filter((item) => !item.action);
  const actionItems = items.filter((item) => !!item.action);

  const handleNavigate = (href: string) => {
    onCloseMobile?.();
    onNavigate?.(href);
  };

  const handleAction = (action: "logout") => {
    onCloseMobile?.();
    onAction?.(action);
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen z-50 flex flex-col ${bgColor} text-white transition-all duration-300 ${
        isCollapsed ? "lg:w-16" : "lg:w-64"
      } w-64 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      <AppSidebarHeader
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
        onCloseMobile={onCloseMobile}
        user={user}
      />

      <nav className="flex-1 overflow-y-auto overflow-x-hidden">
        <ul>
          {navItems
            .filter((item) => item.isVisible !== false)
            .map((item) =>
              item.children ? (
                <AppSidebarGroup
                  key={item.id}
                  item={item}
                  isCollapsed={isCollapsed}
                  currentPath={currentPath}
                  onNavigate={handleNavigate}
                />
              ) : (
                <AppSidebarItemComponent
                  key={item.id}
                  item={item}
                  isCollapsed={isCollapsed}
                  isActive={isSidebarItemActive(item, currentPath)}
                  onNavigate={handleNavigate}
                  onAction={handleAction}
                />
              ),
            )}
        </ul>
      </nav>

      <AppSidebarFooter
        items={actionItems}
        isCollapsed={isCollapsed}
        onAction={handleAction}
      />
    </div>
  );
}
