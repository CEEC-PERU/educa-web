import { useQuery } from "@tanstack/react-query";
import { fetchModule, fetchModules } from "./modules.api";
import { modulesKeys } from "./modules.query-keys";

export function useModulesQuery() {
  return useQuery({
    queryKey: modulesKeys.list(),
    queryFn: fetchModules,
  });
}

export function useModuleQuery(id: string | number | undefined) {
  return useQuery({
    queryKey: modulesKeys.detail(id ?? ""),
    queryFn: () => fetchModule(id as string | number),
    enabled: id !== undefined && id !== null && id !== "",
  });
}
