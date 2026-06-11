import { useQuery } from "@tanstack/react-query";
import { fetchEnterpriseById } from "./enterprises.api";
import { enterprisesKeys } from "./enterprises.query-keys";

export function useEnterpriseByIdQuery(enterpriseId: number | undefined) {
  return useQuery({
    queryKey: enterprisesKeys.detail(enterpriseId ?? 0),
    queryFn: () => fetchEnterpriseById(enterpriseId as number),
    enabled: typeof enterpriseId === "number",
  });
}
