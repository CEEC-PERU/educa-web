import React from "react";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";

type AppSidebarHeaderProps = {
  isCollapsed: boolean;
  onToggleCollapse?: () => void;
  user?: {
    name?: string;
    profilePicture?: string;
  };
};

export default function AppSidebarHeader({
  isCollapsed,
  onToggleCollapse,
  user,
}: AppSidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between px-3 h-16 border-b border-white/10 flex-shrink-0">
      <div className="flex items-center gap-2 overflow-hidden">
        <img
          src="https://res.cloudinary.com/dk2red18f/image/upload/v1770755434/WEB_EDUCA/LOGO_A365_BLANCO_sin_texto_dnmnm9.png"
          alt="Logo"
          className="h-8 w-8 flex-shrink-0 object-contain"
        />
        {!isCollapsed && user?.name && (
          <span className="text-white text-sm font-medium truncate">
            {user.name}
          </span>
        )}
      </div>

      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded transition-colors flex-shrink-0"
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
