// hooks/useEvaluationWizard.ts
import { useState } from "react";
import {
  createEvaluation,
  createQuestion,
  createOption,
} from "@/features/evaluations/evaluations.api";
import { useEvaluationsQuery } from "@/features/evaluations/evaluations.queries";
import { evaluationsKeys } from "@/features/evaluations/evaluations.query-keys";
import { useQueryClient } from "@tanstack/react-query";
import { uploadImage } from "../../../services/imageService";
import { Evaluation, Question, Option } from "../../../interfaces/Evaluation";

export const useEvaluationWizard = () => {
  const queryClient = useQueryClient();
  const evaluationsQuery = useEvaluationsQuery();
  const evaluations = evaluationsQuery.data ?? [];
  const queryError = evaluationsQuery.isError
    ? "Error fetching evaluations"
    : null;

  const [step, setStep] = useState(1);
  const [evaluationData, setEvaluationData] = useState<
    Omit<Evaluation, "evaluation_id">
  >({ name: "", description: "" });
  const [questionsData, setQuestionsData] = useState<
    (Omit<Question, "question_id"> & { imageFile?: File | null })[]
  >([]);
  const [optionsData, setOptionsData] = useState<{
    [key: number]: Omit<Option, "option_id">[];
  }>({});
  const [error, setError] = useState<string | null>(null);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const resetForm = () => {
    setEvaluationData({ name: "", description: "" });
    setQuestionsData([]);
    setOptionsData({});
    setStep(1);
  };

  const handleImageUpload = async (
    file: File,
    folder: string,
  ): Promise<string> => {
    try {
      const response = await uploadImage(file, folder);
      return response;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const completeForm = async () => {
    try {
      const newEvaluation = await createEvaluation(evaluationData);
      const evaluationId = newEvaluation.evaluation_id;

      for (const question of questionsData) {
        if (question.imageFile) {
          question.image = await handleImageUpload(
            question.imageFile,
            "Preguntas",
          );
        }

        if (
          question.question_text &&
          question.type_id !== undefined &&
          question.score !== undefined
        ) {
          const newQuestion = await createQuestion({
            ...question,
            evaluation_id: evaluationId,
          });
          const questionOptions =
            optionsData[questionsData.indexOf(question)] || [];

          for (const option of questionOptions) {
            await createOption({
              ...option,
              question_id: newQuestion.question_id,
            });
          }
        }
      }
      queryClient.invalidateQueries({ queryKey: evaluationsKeys.all });
      resetForm();
      return evaluationId; // Retornamos el ID para usarlo en la página que lo llama
    } catch (error) {
      console.error("Error creating evaluation:", error);
      throw error;
    }
  };

  return {
    step,
    evaluationData,
    questionsData,
    optionsData,
    evaluations,
    error: error ?? queryError,
    nextStep,
    prevStep,
    setEvaluationData,
    setQuestionsData,
    setOptionsData,
    completeForm,
    resetForm,
  };
};
