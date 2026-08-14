import type { SidebarRoleConfig } from "./app-sidebar.types";
import { contentSidebarBaseItems } from "./app-sidebar.content.config";
import { corporateSidebarItems } from "./app-sidebar.corporate.config";
import { studentSidebarItems } from "./app-sidebar.student.config";
import { supervisorSidebarItems } from "./app-sidebar.supervisor.config";

const _registry = new Map<number, SidebarRoleConfig>();

export function registerSidebarConfig(config: SidebarRoleConfig): void {
  _registry.set(config.roleId, config);
}

export function getSidebarConfigByRole(roleId: number): SidebarRoleConfig {
  return _registry.get(roleId) ?? (_registry.get(3) as SidebarRoleConfig);
}

registerSidebarConfig({
  roleId: 1,
  label: "Estudiante",
  items: studentSidebarItems,
});

registerSidebarConfig({
  roleId: 2,
  label: "Corporativo",
  items: corporateSidebarItems,
});

registerSidebarConfig({
  roleId: 3,
  label: "Gestor de Contenido",
  items: contentSidebarBaseItems,
});

registerSidebarConfig({
  roleId: 6,
  label: "Supervisor",
  items: supervisorSidebarItems,
});
