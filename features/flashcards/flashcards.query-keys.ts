export const flashcardsKeys = {
  all: ["flashcards"] as const,
  byModule: (moduleId: number) =>
    [...flashcardsKeys.all, "module", moduleId] as const,
  detail: (id: number) => [...flashcardsKeys.all, "detail", id] as const,
};
