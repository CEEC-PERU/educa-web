import { useFlashcardsByModuleQuery } from "@/features/flashcards/flashcards.queries";
import { getUserFacingMessage } from "@/lib/http/error";

export const useFlashcards = (module_id: number) => {
  const query = useFlashcardsByModuleQuery(module_id);
  return {
    flashcards: query.data ?? [],
    error: query.isError ? getUserFacingMessage(query.error) : null,
    isLoading: query.isLoading,
  };
};
