import { useEffect, useState } from 'react';
import { getFlashcards } from '../services/flashcardsService';
import { useAuth } from '../context/AuthContext';
import { Flashcard } from '@/interfaces/Flashcard';

export const useFlashcards= (module_id :number) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth();
//useEffect
  useEffect(() => {
    const fetchFlascards = async () => {
      if (!token) {
        return;
      }
      setIsLoading(true);
      try {
        const response = await getFlashcards(token, module_id );
        if (response === null) {
          setFlashcards([]); 
        } else if (Array.isArray(response)) {
          setFlashcards(response); 
        } else {
          setFlashcards([response]); 
        }
      } catch (error) {
        console.error('Error fetching course detail:', error);
        setError('Error fetching course detail. Please try again.');
      } finally {
        setIsLoading(false);
        //carga 
      }
    };

    fetchFlascards();
  }, [token]);

  return {
    flashcards,
    error,
    isLoading
  };
};

