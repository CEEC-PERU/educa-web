import { API_USER_FLASHCARDS } from '@/utils/Endpoints';
import axios from '../axios';

export const deleteFlashcard = async (flashcardId: number): Promise<void> => {
  await axios.delete(`${API_USER_FLASHCARDS}/${flashcardId}`);
};
