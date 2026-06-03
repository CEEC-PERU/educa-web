export const usersKeys = {
  all: ["users"] as const,
  count: (enterpriseId: number) =>
    [...usersKeys.all, "count", enterpriseId] as const,
  classroom: (userId: number, enterpriseId: number) =>
    [...usersKeys.all, "classroom", userId, enterpriseId] as const,
  detail: (userId: number) =>
    [...usersKeys.all, "detail", userId] as const,
};
