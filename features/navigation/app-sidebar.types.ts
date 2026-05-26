import type React from "react";

export type AppSidebarAction = "logout";

export type SidebarRoleConfig = {
  roleId: number;
  label: string;
  items: AppSidebarItem[];
  bgColor?: string;
};

export type AppSidebarMatchMode = "exact" | "prefix";

export type AppSidebarItem = {
  id: string;
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
  isVisible?: boolean;
  children?: AppSidebarItem[];
  action?: AppSidebarAction;
  matchMode?: AppSidebarMatchMode;
};
