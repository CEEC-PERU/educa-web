// hooks/useEvaluationWizard.ts
import { useState, useEffect } from 'react';
import {
  addEvaluation,
  addQuestion,
  addOption,
  getEvaluations,
} from '../../../services/evaluationService';
import { uploadImage } from '../../../services/imageService';
import { Evaluation, Question, Option } from '../../../interfaces/Evaluation';

export const useEvaluationWizard = () => {
  const [step, setStep] = useState(1);
  const [evaluationData, setEvaluationData] = useState<
    Omit<Evaluation, 'evaluation_id'>
  >({ name: '', description: '' });
  const [questionsData, setQuestionsData] = useState<
    (Omit<Question, 'question_id'> & { imageFile?: File | null })[]
  >([]);
  const [optionsData, setOptionsData] = useState<{
    [key: number]: Omit<Option, 'option_id'>[];
  }>({});
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const data = await getEvaluations();
        setEvaluations(data);
      } catch (error) {
        setError('Error fetching evaluations');
        console.error('Error fetching evaluations:', error);
      }
    };

    fetchEvaluations();
  }, []);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const resetForm = () => {
    setEvaluationData({ name: '', description: '' });
    setQuestionsData([]);
    setOptionsData({});
    setStep(1);
  };

  const handleImageUpload = async (
    file: File,
    folder: string
  ): Promise<string> => {
    try {
      const response = await uploadImage(file, folder);
      return response;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const completeForm = async () => {
    try {
      const newEvaluation = await addEvaluation(evaluationData);
      const evaluationId = newEvaluation.evaluation_id;

      for (const question of questionsData) {
        if (question.imageFile) {
          question.image = await handleImageUpload(
            question.imageFile,
            'Preguntas'
          );
        }

        if (
          question.question_text &&
          question.type_id !== undefined &&
          question.score !== undefined
        ) {
          const newQuestion = await addQuestion({
            ...question,
            evaluation_id: evaluationId,
          });
          const questionOptions =
            optionsData[questionsData.indexOf(question)] || [];

          for (const option of questionOptions) {
            await addOption({
              ...option,
              question_id: newQuestion.question_id,
            });
          }
        }
      }
      resetForm();
      return evaluationId; // Retornamos el ID para usarlo en la página que lo llama
    } catch (error) {
      console.error('Error creating evaluation:', error);
      throw error;
    }
  };

  return {
    step,
    evaluationData,
    questionsData,
    optionsData,
    evaluations,
    error,
    nextStep,
    prevStep,
    setEvaluationData,
    setQuestionsData,
    setOptionsData,
    completeForm,
    resetForm,
  };
};
