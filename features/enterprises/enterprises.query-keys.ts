export const enterprisesKeys = {
  all: ["enterprises"] as const,
  detail: (enterpriseId: number) =>
    [...enterprisesKeys.all, "detail", enterpriseId] as const,
};
