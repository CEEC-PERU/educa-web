import type { AppSidebarItem } from "../app-sidebar.types";

export function isSidebarItemActive(
  item: AppSidebarItem,
  currentPath: string,
): boolean {
  if (!item.href) return false;

  if (item.matchMode === "prefix") {
    return currentPath === item.href || currentPath.startsWith(item.href + "/");
  }

  return currentPath === item.href;
}
