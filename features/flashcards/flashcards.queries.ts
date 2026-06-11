import { useQuery } from "@tanstack/react-query";
import type { Flashcard } from "@/interfaces/Flashcard";
import type { AppError } from "@/lib/http/error";
import { fetchFlashcardsByModule, fetchFlashcardById } from "./flashcards.api";
import { flashcardsKeys } from "./flashcards.query-keys";

export function useFlashcardsByModuleQuery(moduleId: number | undefined) {
  return useQuery<Flashcard[], AppError>({
    queryKey:
      typeof moduleId === "number" && Number.isFinite(moduleId)
        ? flashcardsKeys.byModule(moduleId)
        : [...flashcardsKeys.all, "module", "disabled"],
    queryFn: () => fetchFlashcardsByModule(moduleId as number),
    enabled: typeof moduleId === "number" && Number.isFinite(moduleId),
  });
}

export function useFlashcardByIdQuery(flashcardId: number | undefined) {
  return useQuery<Flashcard, AppError>({
    queryKey:
      typeof flashcardId === "number" && Number.isFinite(flashcardId)
        ? flashcardsKeys.detail(flashcardId)
        : [...flashcardsKeys.all, "detail", "disabled"],
    queryFn: () => fetchFlashcardById(flashcardId as number),
    enabled: typeof flashcardId === "number" && Number.isFinite(flashcardId),
  });
}
