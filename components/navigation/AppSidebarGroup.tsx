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
};

export default function AppSidebarGroup({
  item,
  isCollapsed,
  currentPath,
  onNavigate,
}: AppSidebarGroupProps) {
  const Icon = item.icon;

  const isAnyChildActive =
    item.children?.some((child) => isSidebarItemActive(child, currentPath)) ??
    false;

  const [isExpanded, setIsExpanded] = useState(isAnyChildActive);

  useEffect(() => {
    if (isAnyChildActive) setIsExpanded(true);
  }, [isAnyChildActive]);

  if (isCollapsed) {
    const firstChild = item.children?.[0];
    return (
      <li>
        <button
          title={item.label}
          onClick={() =>
            firstChild?.href ? onNavigate?.(firstChild.href) : undefined
          }
          className={`flex items-center w-full p-4 text-white transition-colors ${
            isAnyChildActive ? "bg-sidebar-hover" : "hover:bg-sidebar-hover"
          }`}
        >
          {Icon && <Icon className="h-6 w-6 flex-shrink-0" />}
        </button>
      </li>
    );
  }

  return (
    <li>
      <button
        onClick={() => {
          if (item.href) onNavigate?.(item.href);
          setIsExpanded((prev) => !prev);
        }}
        className={`flex items-center w-full p-4 text-white transition-colors ${
          isAnyChildActive ? "bg-white/20" : "hover:bg-white/10"
        }`}
      >
        {Icon && <Icon className="h-6 w-6 flex-shrink-0" />}
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
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
