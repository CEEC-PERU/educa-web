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
  onToggleCollapse?: () => void;
  onNavigate?: (href: string) => void;
  onAction?: (action: "logout") => void;
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
  onToggleCollapse,
  onNavigate,
  onAction,
  currentPath = "",
  bgColor = "bg-blue-600",
  user,
}: AppSidebarProps) {
  const navItems = items.filter((item) => !item.action);
  const actionItems = items.filter((item) => !!item.action);

  return (
    <div
      className={`fixed top-0 left-0 h-screen z-50 flex flex-col ${bgColor} text-white rounded-r-lg transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <AppSidebarHeader
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
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
                  onNavigate={onNavigate}
                />
              ) : (
                <AppSidebarItemComponent
                  key={item.id}
                  item={item}
                  isCollapsed={isCollapsed}
                  isActive={isSidebarItemActive(item, currentPath)}
                  onNavigate={onNavigate}
                  onAction={onAction}
                />
              ),
            )}
        </ul>
      </nav>

      <AppSidebarFooter
        items={actionItems}
        isCollapsed={isCollapsed}
        onAction={onAction}
      />
    </div>
  );
}
