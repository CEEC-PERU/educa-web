import { http } from "@/lib/http/client";
import { API_USER_FLASHCARDS } from "@/utils/Endpoints";
import type { Flashcard } from "@/interfaces/Flashcard";

export async function fetchFlashcardsByModule(
  moduleId: number,
): Promise<Flashcard[]> {
  const { data } = await http.get<Flashcard | Flashcard[] | null>(
    `${API_USER_FLASHCARDS}/module/${moduleId}`,
  );
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}

export async function fetchFlashcardById(
  flashcardId: number,
): Promise<Flashcard> {
  const { data } = await http.get<Flashcard>(
    `${API_USER_FLASHCARDS}/${flashcardId}`,
  );
  return data;
}

export interface CreateFlashcardInput {
  question: string;
  moduleId: number;
  correctImages: File[];
  incorrectImages: File[];
}

export async function createFlashcard(
  input: CreateFlashcardInput,
): Promise<Flashcard> {
  const formData = new FormData();
  formData.append("question", input.question);
  formData.append("module_id", String(input.moduleId));
  input.correctImages.forEach((file) => {
    formData.append("correct_images", file);
  });
  input.incorrectImages.forEach((file) => {
    formData.append("incorrect_images", file);
  });
  const { data } = await http.post<Flashcard>(API_USER_FLASHCARDS, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export interface UpdateFlashcardInput {
  question: string;
  correct_answer: string[];
  incorrect_answer: string[];
}

export async function updateFlashcard(
  flashcardId: number,
  input: UpdateFlashcardInput,
): Promise<void> {
  await http.put(`${API_USER_FLASHCARDS}/${flashcardId}`, input);
}

export async function deleteFlashcard(flashcardId: number): Promise<void> {
  await http.delete(`${API_USER_FLASHCARDS}/${flashcardId}`);
}
