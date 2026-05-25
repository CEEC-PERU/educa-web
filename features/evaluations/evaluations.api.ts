import { http } from "@/lib/http/client";
import {
  API_EVALUATIONS,
  API_QUESTIONS,
  API_OPTIONS,
  API_QUESTION_TYPES,
} from "@/utils/Endpoints";
import type {
  Evaluation,
  Question,
  Option,
  QuestionType,
} from "@/interfaces/Evaluation";

export async function fetchAvailableEvaluations(): Promise<Evaluation[]> {
  const { data } = await http.get<Evaluation[]>(`${API_EVALUATIONS}/available`);
  return data;
}

export async function fetchEvaluations(): Promise<Evaluation[]> {
  const { data } = await http.get<Evaluation[]>(API_EVALUATIONS);
  return data;
}

export async function fetchQuestionTypes(): Promise<QuestionType[]> {
  const { data } = await http.get<QuestionType[]>(API_QUESTION_TYPES);
  return data;
}

export interface EvaluationDetailResponse {
  evaluation: Evaluation;
  questions: Question[];
}

export async function fetchEvaluationById(
  id: number,
): Promise<EvaluationDetailResponse> {
  const { data } = await http.get<EvaluationDetailResponse>(
    `${API_EVALUATIONS}/${id}`,
  );
  const questionsWithOptions = await Promise.all(
    data.questions.map(async (question) => {
      const { data: options } = await http.get<Option[]>(
        `${API_OPTIONS}/question/${question.question_id}`,
      );
      return { ...question, options };
    }),
  );
  return { evaluation: data.evaluation, questions: questionsWithOptions };
}

export async function createEvaluation(
  evaluation: Omit<Evaluation, "evaluation_id">,
): Promise<Evaluation> {
  const { data } = await http.post<Evaluation>(API_EVALUATIONS, evaluation);
  return data;
}

export async function createQuestion(
  question: Omit<Question, "question_id">,
): Promise<Question> {
  const { data } = await http.post<Question>(API_QUESTIONS, question);
  return data;
}

export async function createOption(
  option: Omit<Option, "option_id">,
): Promise<Option> {
  const { data } = await http.post<Option>(API_OPTIONS, option);
  return data;
}

export async function updateEvaluation(
  evaluation: Evaluation,
  questions: Question[],
): Promise<void> {
  await http.put(`${API_EVALUATIONS}/${evaluation.evaluation_id}`, {
    evaluation,
    questions,
  });
}

export async function deleteEvaluation(id: number): Promise<void> {
  await http.delete(`${API_EVALUATIONS}/${id}`);
}
