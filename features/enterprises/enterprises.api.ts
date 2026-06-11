import { http } from "@/lib/http/client";
import { API_GET_ENTERPRISE } from "@/utils/Endpoints";
import type { Enterprise } from "@/interfaces/Enterprise";

export async function fetchEnterpriseById(enterpriseId: number): Promise<Enterprise> {
  const { data } = await http.get<Enterprise>(`${API_GET_ENTERPRISE}/${enterpriseId}`);
  return data;
}
