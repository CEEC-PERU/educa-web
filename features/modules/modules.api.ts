import { http } from "@/lib/http/client";
import { API_MODULES } from "@/utils/Endpoints";
import type { Module } from "@/interfaces/Module";

export type ModuleDraft = Omit<
  Module,
  "module_id" | "created_at" | "updated_at"
>;

export async function fetchModules(): Promise<Module[]> {
  const { data } = await http.get<Module[]>(API_MODULES);
  return data;
}

export async function fetchModule(moduleId: string | number): Promise<Module> {
  const { data } = await http.get<Module>(`${API_MODULES}/${moduleId}`);
  return data;
}

export async function createModule(
  moduleData: Partial<Module>,
): Promise<Module> {
  const { data } = await http.post<Module>(API_MODULES, moduleData);
  return data;
}

export async function updateModule(
  moduleId: string | number,
  moduleData: Partial<Module>,
): Promise<void> {
  await http.put(`${API_MODULES}/${moduleId}`, moduleData);
}

export async function updateModuleStatus(
  moduleId: number,
  isActive: boolean,
): Promise<void> {
  await http.put(`${API_MODULES}/${moduleId}/status`, { is_active: isActive });
}

export async function deleteModule(moduleId: number): Promise<void> {
  await http.delete(`${API_MODULES}/${moduleId}`);
}
