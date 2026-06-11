export const modulesKeys = {
  all: ["modules"] as const,
  list: () => [...modulesKeys.all, "list"] as const,
  detail: (id: string | number) => [...modulesKeys.all, "detail", id] as const,
};
