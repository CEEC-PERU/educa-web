export const professorsKeys = {
  all: ["professors"] as const,
  list: () => [...professorsKeys.all, "list"] as const,
  detail: (id: string | number) =>
    [...professorsKeys.all, "detail", id] as const,
};

export const levelsKeys = {
  all: ["levels"] as const,
  list: () => [...levelsKeys.all, "list"] as const,
};
