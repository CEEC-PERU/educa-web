import { API_CAMPAIGNS } from "@/utils/Endpoints";

export interface Campaign {
  id: number;
  name: string;
  ceco: string | null;
  enterprise_id: number;
  users_count: number;
}

export interface CampaignInput {
  name: string;
  ceco?: string | null;
  enterprise_id?: number;
}

const readError = (payload: unknown, fallback: string) => {
  if (payload && typeof payload === "object" && "message" in payload) {
    return String((payload as { message: unknown }).message);
  }
  return fallback;
};

const request = async <T>(
  path: string,
  token: string,
  options: RequestInit = {},
  fallbackError = "No se pudo completar la operacion.",
): Promise<T> => {
  const response = await fetch(`${API_CAMPAIGNS}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(readError(payload, fallbackError));
  }
  return payload as T;
};

export const getCampaigns = async (
  token: string,
  enterpriseId?: number | null,
): Promise<Campaign[]> => {
  const query = enterpriseId ? `?enterprise_id=${enterpriseId}` : "";
  return request<Campaign[]>(query, token, { method: "GET" }, "No se pudieron cargar las campañas.");
};

export const createCampaign = async (
  token: string,
  input: CampaignInput,
): Promise<Campaign> => request<Campaign>(
  "",
  token,
  { method: "POST", body: JSON.stringify(input) },
  "No se pudo crear la campaña.",
);

export const updateCampaign = async (
  token: string,
  id: number,
  input: CampaignInput,
): Promise<Campaign> => request<Campaign>(
  `/${id}`,
  token,
  { method: "PUT", body: JSON.stringify(input) },
  "No se pudo actualizar la campaña.",
);

export const deleteCampaign = async (
  token: string,
  id: number,
): Promise<{ id: number; deleted: boolean }> => request<{ id: number; deleted: boolean }>(
  `/${id}`,
  token,
  { method: "DELETE" },
  "No se pudo eliminar la campaña.",
);
