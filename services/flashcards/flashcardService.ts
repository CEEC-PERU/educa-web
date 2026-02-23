import { API_USER_FLASHCARDS } from '@/utils/Endpoints';
import { Flashcard } from '@/interfaces/Flashcard';
import axios from '../axios';

export const deleteFlashcard = async (flashcardId: number): Promise<void> => {
  await axios.delete(`${API_USER_FLASHCARDS}/${flashcardId}`);
};

export const getFlashcardById = async (
  flashcardId: number,
): Promise<Flashcard> => {
  const response = await axios.get<Flashcard>(
    `${API_USER_FLASHCARDS}/${flashcardId}`,
  );
  return response.data;
};

export const updateFlashcard = async (
  flashcardId: number,
  data: {
    question: string;
    correct_answer: string[];
    incorrect_answer: string[];
  },
): Promise<void> => {
  await axios.put(`${API_USER_FLASHCARDS}/${flashcardId}`, data);
};
