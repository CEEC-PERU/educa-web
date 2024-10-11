import axios from './axios';
import {Flashcard } from '../interfaces/Flashcard';
import { API_USER_FLASHCARDS } from '../utils/Endpoints';

export const getFlashcards = async (userToken: string, module_id: number): Promise<Flashcard| null> => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };
      const response = await axios.get<Flashcard>(`${API_USER_FLASHCARDS}/module/${module_id}`, config);
      if (response.data) {
        return response.data; 
      } else {
        console.warn('No enterprise found for user:', module_id);
        return null; 
      }
    } catch (error) {
      console.error('Error getting enterprise:', error);
      throw new Error('Error getting enterprise');
    }
  };