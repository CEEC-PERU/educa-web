import { useQuery } from "@tanstack/react-query";
import {
  fetchCourse,
  fetchCourses,
  fetchModulesByCourseId,
} from "./courses.api";
import { coursesKeys } from "./courses.query-keys";

export function useCoursesQuery() {
  return useQuery({
    queryKey: coursesKeys.list(),
    queryFn: fetchCourses,
  });
}

export function useCourseQuery(id: string | number | undefined) {
  return useQuery({
    queryKey: coursesKeys.detail(id ?? ""),
    queryFn: () => fetchCourse(id as string | number),
    enabled: id !== undefined && id !== null && id !== "",
  });
}

export function useCourseModulesQuery(courseId: number | undefined) {
  return useQuery({
    queryKey: coursesKeys.modules(courseId ?? ""),
    queryFn: () => fetchModulesByCourseId(courseId as number),
    enabled: typeof courseId === "number",
  });
}
