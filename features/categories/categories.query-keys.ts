export const categoriesKeys = {
  all: ["categories"] as const,
  list: () => [...categoriesKeys.all, "list"] as const,
  detail: (id: string | number) =>
    [...categoriesKeys.all, "detail", id] as const,
};
