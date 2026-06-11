import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Evaluation, Question, Option } from "@/interfaces/Evaluation";
import type { AppError } from "@/lib/http/error";
import {
  createEvaluation,
  createQuestion,
  createOption,
  updateEvaluation,
  deleteEvaluation,
} from "./evaluations.api";
import { evaluationsKeys } from "./evaluations.query-keys";

export function useCreateEvaluationMutation() {
  const queryClient = useQueryClient();
  return useMutation<Evaluation, AppError, Omit<Evaluation, "evaluation_id">>({
    mutationFn: (evaluation) => createEvaluation(evaluation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: evaluationsKeys.all });
    },
  });
}

export function useCreateQuestionMutation() {
  return useMutation<Question, AppError, Omit<Question, "question_id">>({
    mutationFn: (question) => createQuestion(question),
  });
}

export function useCreateOptionMutation() {
  return useMutation<Option, AppError, Omit<Option, "option_id">>({
    mutationFn: (option) => createOption(option),
  });
}

interface UpdateEvaluationVariables {
  evaluation: Evaluation;
  questions: Question[];
}

export function useUpdateEvaluationMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, AppError, UpdateEvaluationVariables>({
    mutationFn: ({ evaluation, questions }) =>
      updateEvaluation(evaluation, questions),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: evaluationsKeys.all });
      queryClient.invalidateQueries({
        queryKey: evaluationsKeys.detail(variables.evaluation.evaluation_id),
      });
    },
  });
}

export function useDeleteEvaluationMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, AppError, number>({
    mutationFn: (id) => deleteEvaluation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: evaluationsKeys.all });
    },
  });
}
