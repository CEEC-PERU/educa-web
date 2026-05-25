import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Professor } from "@/interfaces/Professor";
import type { AppError } from "@/lib/http/error";
import {
  createProfessor,
  updateProfessor,
  deleteProfessor,
  type ProfessorDraft,
} from "./professors.api";
import { professorsKeys } from "./professors.query-keys";

interface CreateProfessorVariables {
  professor: ProfessorDraft;
  imageFile: File;
}

interface UpdateProfessorVariables {
  professorId: number;
  professor: ProfessorDraft;
  imageFile?: File | null;
}

export function useCreateProfessorMutation() {
  const queryClient = useQueryClient();
  return useMutation<Professor, AppError, CreateProfessorVariables>({
    mutationFn: ({ professor, imageFile }) =>
      createProfessor(professor, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: professorsKeys.all });
    },
  });
}

export function useUpdateProfessorMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, AppError, UpdateProfessorVariables>({
    mutationFn: ({ professorId, professor, imageFile }) =>
      updateProfessor(professorId, professor, imageFile),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: professorsKeys.all });
      queryClient.invalidateQueries({
        queryKey: professorsKeys.detail(variables.professorId),
      });
    },
  });
}

export function useDeleteProfessorMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, AppError, number>({
    mutationFn: (professorId) => deleteProfessor(professorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: professorsKeys.all });
    },
  });
}
