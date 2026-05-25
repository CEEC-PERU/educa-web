import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Category } from "@/interfaces/Category";
import type { AppError } from "@/lib/http/error";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "./categories.api";
import { categoriesKeys } from "./categories.query-keys";

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation<Category, AppError, string>({
    mutationFn: (name) => createCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
    },
  });
}

interface UpdateCategoryVariables {
  categoryId: number;
  category: Category;
}

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation<Category, AppError, UpdateCategoryVariables>({
    mutationFn: ({ categoryId, category }) =>
      updateCategory(categoryId, category),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
      queryClient.invalidateQueries({
        queryKey: categoriesKeys.detail(variables.categoryId),
      });
    },
  });
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, AppError, number>({
    mutationFn: (categoryId) => deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
    },
  });
}
