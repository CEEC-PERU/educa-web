import React, { useState, useEffect } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import type { AppSidebarItem } from "../../features/navigation/app-sidebar.types";
import { isSidebarItemActive } from "../../features/navigation/utils/isSidebarItemActive";
import AppSidebarItemComponent from "./AppSidebarItem";

type AppSidebarGroupProps = {
  item: AppSidebarItem;
  isCollapsed: boolean;
  currentPath: string;
  onNavigate?: (href: string) => void;
  onCloseMobile?: () => void;
};

export default function AppSidebarGroup({
  item,
  isCollapsed,
  currentPath,
  onNavigate,
  onCloseMobile,
}: AppSidebarGroupProps) {
  const Icon = typeof item.icon === "string" ? undefined : item.icon;
  const imageIcon = typeof item.icon === "string" ? item.icon : undefined;

  const isAnyChildActive =
    item.children?.some((child) => isSidebarItemActive(child, currentPath)) ??
    false;

  const [isExpanded, setIsExpanded] = useState(isAnyChildActive);

  useEffect(() => {
    if (isAnyChildActive) setIsExpanded(true);
  }, [isAnyChildActive]);

  const firstChild = item.children?.[0];
  const renderedIcon = imageIcon ? (
    <img src={imageIcon} alt="" aria-hidden="true" className="h-6 w-6 flex-shrink-0 object-contain mix-blend-screen" />
  ) : (
    Icon && <Icon className="h-6 w-6 flex-shrink-0" />
  );
  const collapsedClassName =
    "flex items-center w-full p-4 text-white transition-colors " +
    (isAnyChildActive ? "bg-sidebar-hover" : "hover:bg-sidebar-hover");
  const groupClassName =
    "flex items-center w-full p-4 text-white transition-colors " +
    (isAnyChildActive ? "bg-white/20" : "hover:bg-white/10");

  return (
    <>
      {isCollapsed && (
        <li className="hidden lg:block">
          <button
            title={item.label}
            onClick={() =>
              firstChild?.href ? onNavigate?.(firstChild.href) : undefined
            }
            className={collapsedClassName}
          >
            {renderedIcon}
          </button>
        </li>
      )}

      <li className={isCollapsed ? "lg:hidden" : ""}>
        <button
          onClick={() => {
            if (item.href) onNavigate?.(item.href);
            setIsExpanded((prev) => !prev);
          }}
          className={groupClassName}
        >
          {renderedIcon}
          <span className="ml-3 text-sm truncate flex-1">{item.label}</span>
          {isExpanded ? (
            <ChevronDownIcon className="h-4 w-4 flex-shrink-0" />
          ) : (
            <ChevronRightIcon className="h-4 w-4 flex-shrink-0" />
          )}
        </button>

        {isExpanded && item.children && (
          <ul className="pl-4 border-l border-white/10 ml-4">
            {item.children.map((child) => (
              <AppSidebarItemComponent
                key={child.id}
                item={child}
                isCollapsed={false}
                isActive={isSidebarItemActive(child, currentPath)}
                onCloseMobile={onCloseMobile}
              />
            ))}
          </ul>
        )}
      </li>
    </>
  );
}