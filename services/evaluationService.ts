// services/evaluationService.ts
import axios from './axios';
import { Evaluation, Question, Option, QuestionType } from '../interfaces/Evaluation';
import { API_EVALUATIONS, API_QUESTIONS, API_OPTIONS, API_QUESTION_TYPES } from '../utils/Endpoints';

export const getQuestionTypes = async (): Promise<QuestionType[]> => {
  const response = await axios.get<QuestionType[]>(API_QUESTION_TYPES);
  return response.data;
};

export const getEvaluations = async (): Promise<Evaluation[]> => {
  const response = await axios.get<Evaluation[]>(API_EVALUATIONS);
  return response.data;
};

export const getQuestionsByEvaluationId = async (evaluationId: number): Promise<Question[]> => {
  const response = await axios.get<Question[]>(`${API_QUESTIONS}/evaluation/${evaluationId}`);
  return response.data;
};

export const addOption = async (option: Omit<Option, 'option_id'>): Promise<Option> => {
  const response = await axios.post<Option>(API_OPTIONS, option);
  return response.data;
};

export const addQuestion = async (question: Omit<Question, 'question_id'>): Promise<Question> => {
  const response = await axios.post<Question>(API_QUESTIONS, question);
  return response.data;
};

export const addEvaluation = async (evaluation: Omit<Evaluation, 'evaluation_id'>): Promise<Evaluation> => {
  const response = await axios.post<Evaluation>(API_EVALUATIONS, evaluation);
  return response.data;
};
