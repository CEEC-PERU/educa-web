import React from "react";
import type { AppSidebarItem } from "../../features/navigation/app-sidebar.types";

type AppSidebarFooterProps = {
  items: AppSidebarItem[];
  isCollapsed: boolean;
  onAction?: (action: "logout") => void;
};

export default function AppSidebarFooter({
  items,
  isCollapsed,
  onAction,
}: AppSidebarFooterProps) {
  if (items.length === 0) return null;

  return (
    <div className="border-t border-white/10 flex-shrink-0">
      <ul>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.id}>
              <button
                title={isCollapsed ? item.label : undefined}
                onClick={() => item.action && onAction?.(item.action)}
                className="flex items-center w-full p-4 text-white hover:bg-white/10 transition-colors text-left"
              >
                {Icon && <Icon className="h-6 w-6 flex-shrink-0" />}
                {!isCollapsed && (
                  <span className="ml-3 text-sm">{item.label}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
