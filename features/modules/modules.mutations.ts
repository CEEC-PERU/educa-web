import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AppError } from "@/lib/http/error";
import type { Module } from "@/interfaces/Module";
import { coursesKeys } from "@/features/courses/courses.query-keys";
import {
  createModule,
  deleteModule,
  updateModule,
  updateModuleStatus,
} from "./modules.api";
import { modulesKeys } from "./modules.query-keys";

function invalidateModulesAndCourses(
  queryClient: ReturnType<typeof useQueryClient>,
  courseId?: number,
) {
  queryClient.invalidateQueries({ queryKey: modulesKeys.all });
  if (typeof courseId === "number") {
    queryClient.invalidateQueries({ queryKey: coursesKeys.modules(courseId) });
  } else {
    queryClient.invalidateQueries({ queryKey: coursesKeys.all });
  }
}

export function useCreateModuleMutation() {
  const queryClient = useQueryClient();

  return useMutation<Module, AppError, Partial<Module>>({
    mutationFn: createModule,
    onSuccess: (created, variables) => {
      invalidateModulesAndCourses(queryClient, variables.course_id);
    },
  });
}

export function useUpdateModuleMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AppError,
    { id: string | number; module: Partial<Module> }
  >({
    mutationFn: ({ id, module }) => updateModule(id, module),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: modulesKeys.list() });
      queryClient.invalidateQueries({
        queryKey: modulesKeys.detail(variables.id),
      });
      invalidateModulesAndCourses(queryClient, variables.module.course_id);
    },
  });
}

export function useUpdateModuleStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AppError,
    { moduleId: number; isActive: boolean; courseId?: number }
  >({
    mutationFn: ({ moduleId, isActive }) =>
      updateModuleStatus(moduleId, isActive),
    onSuccess: (_, variables) => {
      invalidateModulesAndCourses(queryClient, variables.courseId);
      queryClient.invalidateQueries({
        queryKey: modulesKeys.detail(variables.moduleId),
      });
    },
  });
}

export function useDeleteModuleMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, { moduleId: number; courseId?: number }>({
    mutationFn: ({ moduleId }) => deleteModule(moduleId),
    onSuccess: (_, variables) => {
      invalidateModulesAndCourses(queryClient, variables.courseId);
    },
  });
}
