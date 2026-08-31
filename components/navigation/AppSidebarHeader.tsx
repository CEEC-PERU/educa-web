import React from "react";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

type AppSidebarHeaderProps = {
  isCollapsed: boolean;
  onToggleCollapse?: () => void;
  onCloseMobile?: () => void;
  user?: {
    name?: string;
    profilePicture?: string;
  };
};

export default function AppSidebarHeader({
  isCollapsed,
  onToggleCollapse,
  onCloseMobile,
  user,
}: AppSidebarHeaderProps) {
  const initial = user?.name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div
      className={`flex items-center justify-between px-3 h-16 border-b border-white/10 flex-shrink-0 ${
        isCollapsed ? "lg:justify-center" : ""
      }`}
    >
      <div
        className={`flex items-center gap-2 overflow-hidden ${
          isCollapsed ? "lg:hidden" : ""
        }`}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10 ring-2 ring-brandrosado-800">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user?.name ?? "Usuario"}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-brandrosado-800">
              {initial}
            </span>
          )}
        </div>
        {user?.name && (
          <span className="text-white text-sm font-medium truncate">
            {user.name}
          </span>
        )}
      </div>

      <button
        onClick={onCloseMobile}
        className="text-white/80 hover:text-white hover:bg-sidebar-hover p-1 rounded transition-colors flex-shrink-0 lg:hidden"
        aria-label="Cerrar menú"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>

      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="text-white/80 hover:text-white hover:bg-sidebar-hover p-1 rounded transition-colors flex-shrink-0 hidden lg:block"
          aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {isCollapsed ? (
            <ChevronDoubleRightIcon className="h-5 w-5" />
          ) : (
            <ChevronDoubleLeftIcon className="h-5 w-5" />
          )}
        </button>
      )}
    </div>
  );
}
