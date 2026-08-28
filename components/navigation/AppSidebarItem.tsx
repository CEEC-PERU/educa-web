import React from "react";
import type { AppSidebarItem as AppSidebarItemType } from "../../features/navigation/app-sidebar.types";

type AppSidebarItemProps = {
  item: AppSidebarItemType;
  isCollapsed: boolean;
  isActive?: boolean;
  onNavigate?: (href: string) => void;
  onAction?: (action: "logout") => void;
};

export default function AppSidebarItem({
  item,
  isCollapsed,
  isActive,
  onNavigate,
  onAction,
}: AppSidebarItemProps) {
  const Icon = item.icon;

  const handleClick = () => {
    if (item.action && onAction) {
      onAction(item.action);
    } else if (item.href && onNavigate) {
      onNavigate(item.href);
    }
  };

  const hasBadge = item.badgeCount != null && item.badgeCount > 0;

  return (
    <li>
      <button
        onClick={handleClick}
        title={isCollapsed ? item.label : undefined}
        className={`relative flex items-center w-full p-4 text-white transition-colors text-left ${
          isActive ? "bg-sidebar-hover font-semibold" : "hover:bg-sidebar-hover"
        }`}
      >
        {Icon && <Icon className="h-6 w-6 flex-shrink-0" />}

        <span
          className={`ml-3 text-sm truncate flex-1 ${isCollapsed ? "lg:hidden" : ""}`}
        >
          {item.label}
        </span>
        {hasBadge && (
          <span
            className={`ml-2 bg-white text-blue-600 text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center ${
              isCollapsed ? "lg:hidden" : ""
            }`}
          >
            {item.badgeCount}
          </span>
        )}

        {isCollapsed && hasBadge && (
          <span className="hidden lg:block absolute top-2 right-2 h-2 w-2 bg-red-400 rounded-full" />
        )}
      </button>
    </li>
  );
}
