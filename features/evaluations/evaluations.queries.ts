import { useQuery } from "@tanstack/react-query";
import {
  fetchAvailableEvaluations,
  fetchEvaluations,
  fetchEvaluationById,
  fetchQuestionTypes,
} from "./evaluations.api";
import { evaluationsKeys, questionTypesKeys } from "./evaluations.query-keys";

export function useAvailableEvaluationsQuery() {
  return useQuery({
    queryKey: evaluationsKeys.available(),
    queryFn: fetchAvailableEvaluations,
  });
}

export function useEvaluationsQuery() {
  return useQuery({
    queryKey: evaluationsKeys.list(),
    queryFn: fetchEvaluations,
  });
}

export function useEvaluationByIdQuery(id: number | undefined) {
  return useQuery({
    queryKey: evaluationsKeys.detail(id ?? "missing"),
    queryFn: () => fetchEvaluationById(id as number),
    enabled: typeof id === "number" && Number.isFinite(id),
  });
}

export function useQuestionTypesQuery() {
  return useQuery({
    queryKey: questionTypesKeys.list(),
    queryFn: fetchQuestionTypes,
  });
}
