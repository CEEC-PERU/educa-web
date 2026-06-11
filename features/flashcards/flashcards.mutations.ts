import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Flashcard } from "@/interfaces/Flashcard";
import type { AppError } from "@/lib/http/error";
import {
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
  type CreateFlashcardInput,
  type UpdateFlashcardInput,
} from "./flashcards.api";
import { flashcardsKeys } from "./flashcards.query-keys";

export function useCreateFlashcardMutation() {
  const queryClient = useQueryClient();
  return useMutation<Flashcard, AppError, CreateFlashcardInput>({
    mutationFn: (input) => createFlashcard(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: flashcardsKeys.all });
      queryClient.invalidateQueries({
        queryKey: flashcardsKeys.byModule(variables.moduleId),
      });
    },
  });
}

interface UpdateFlashcardVariables {
  flashcardId: number;
  data: UpdateFlashcardInput;
}

export function useUpdateFlashcardMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, AppError, UpdateFlashcardVariables>({
    mutationFn: ({ flashcardId, data }) => updateFlashcard(flashcardId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: flashcardsKeys.all });
      queryClient.invalidateQueries({
        queryKey: flashcardsKeys.detail(variables.flashcardId),
      });
    },
  });
}

export function useDeleteFlashcardMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, AppError, number>({
    mutationFn: (flashcardId) => deleteFlashcard(flashcardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: flashcardsKeys.all });
    },
  });
}
