export const evaluationsKeys = {
  all: ["evaluations"] as const,
  available: () => [...evaluationsKeys.all, "available"] as const,
  list: () => [...evaluationsKeys.all, "list"] as const,
  detail: (id: string | number) =>
    [...evaluationsKeys.all, "detail", id] as const,
};

export const questionTypesKeys = {
  all: ["question-types"] as const,
  list: () => [...questionTypesKeys.all, "list"] as const,
};
