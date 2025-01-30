import { useState } from 'react';
import {AnswerTemplate} from '../interfaces/AnswerTemplate';
import { createAnswerTemplate} from '../services/answerTemplateService';
import { useAuth } from '../context/AuthContext';



export const useAnswerTemplate = () => {
  const [answerTemplate, setAnswerTemplate] = useState<AnswerTemplate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth();
  const userInfo = user as { id: number };

  const createAnswerTemplateUser = async (answerTemplates: AnswerTemplate[]) => {
    setIsLoading(true);
    try {
      if (!token) {
        throw new Error('Token is null or undefined');
      }

      const response = await createAnswerTemplate(token, answerTemplates);
      setAnswerTemplate(response);  // Adjust to handle multiple answers if needed.
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error updating profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    answerTemplate,
    error,
    isLoading,
    createAnswerTemplateUser,
  };
};
