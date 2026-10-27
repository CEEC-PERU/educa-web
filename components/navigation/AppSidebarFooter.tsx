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
          const Icon = typeof item.icon === "string" ? undefined : item.icon;
          const imageIcon = typeof item.icon === "string" ? item.icon : undefined;
          return (
            <li key={item.id}>
              <button
                type="button"
                title={isCollapsed ? item.label : undefined}
                onClick={() => item.action && onAction?.(item.action)}
                className="flex items-center w-full p-4 text-white hover:bg-sidebar-hover transition-colors text-left"
              >
                {imageIcon ? (
                  <img src={imageIcon} alt="" aria-hidden="true" className="h-6 w-6 flex-shrink-0 object-contain mix-blend-screen" />
                ) : (
                  Icon && <Icon className="h-6 w-6 flex-shrink-0" />
                )}
                <span
                  className={"ml-3 text-sm " + (isCollapsed ? "lg:hidden" : "")}
                >
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}