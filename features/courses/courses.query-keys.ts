export const coursesKeys = {
  all: ["courses"] as const,
  list: () => [...coursesKeys.all, "list"] as const,
  detail: (id: string | number) => [...coursesKeys.all, "detail", id] as const,
  modules: (courseId: string | number) =>
    [...coursesKeys.all, "detail", courseId, "modules"] as const,
  supervisor: (userId: number) =>
    [...coursesKeys.all, "supervisor", userId] as const,
};
