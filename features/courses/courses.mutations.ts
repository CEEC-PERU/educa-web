import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AppError } from "@/lib/http/error";
import {
  createCourse,
  deleteCourse,
  updateCourse,
  type CourseDraft,
  type CreateCourseInput,
} from "./courses.api";
import { coursesKeys } from "./courses.query-keys";

export function useCreateCourseMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, CreateCourseInput>({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coursesKeys.all });
    },
  });
}

export function useUpdateCourseMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AppError,
    { id: string | number; course: CourseDraft }
  >({
    mutationFn: ({ id, course }) => updateCourse(id, course),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: coursesKeys.list() });
      queryClient.invalidateQueries({
        queryKey: coursesKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteCourseMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, string | number>({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coursesKeys.all });
    },
  });
}
