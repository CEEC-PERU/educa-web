import { contentSidebarBaseItems } from "../app-sidebar.content.config";
import type { AppSidebarItem } from "../app-sidebar.types";

export function getContentSidebarItems(
  overrides: Partial<
    Record<string, Pick<AppSidebarItem, "badgeCount" | "isVisible">>
  > = {},
): AppSidebarItem[] {
  return contentSidebarBaseItems.map((item) => {
    const override = overrides[item.id];
    if (!override) return item;
    return { ...item, ...override };
  });
}
