import axios from './axios';
import {
  Evaluation,
  Question,
  Option,
  QuestionType,
} from '../interfaces/Evaluation';
import {
  API_EVALUATIONS,
  API_QUESTIONS,
  API_OPTIONS,
  API_QUESTION_TYPES,
} from '../utils/Endpoints';

export const getAvailableEvaluations = async (): Promise<Evaluation[]> => {
  const response = await axios.get<Evaluation[]>(
    `${API_EVALUATIONS}/available`
  );
  return response.data;
};

export const getQuestionTypes = async (): Promise<QuestionType[]> => {
  const response = await axios.get<QuestionType[]>(API_QUESTION_TYPES);
  return response.data;
};

export const getEvaluations = async (): Promise<Evaluation[]> => {
  const response = await axios.get<Evaluation[]>(API_EVALUATIONS);
  return response.data;
};

export const getQuestionsByEvaluationId = async (
  evaluationId: number
): Promise<Question[]> => {
  const response = await axios.get(`${API_QUESTIONS}/${evaluationId}`);
  return response.data;
};

export const getEvaluationById = async (
  id: number
): Promise<{ evaluation: Evaluation; questions: Question[] }> => {
  try {
    const response = await axios.get<{
      evaluation: Evaluation;
      questions: Question[];
    }>(`${API_EVALUATIONS}/${id}`);
    const evaluationWithOptions = {
      evaluation: response.data.evaluation,
      questions: await Promise.all(
        response.data.questions.map(async (question) => {
          const optionsResponse = await axios.get<Option[]>(
            `${API_OPTIONS}/question/${question.question_id}`
          );
          return { ...question, options: optionsResponse.data };
        })
      ),
    };
    return evaluationWithOptions;
  } catch (error) {
    console.error('Error fetching evaluation:', error);
    throw new Error('Error fetching evaluation');
  }
};

export const addOption = async (
  option: Omit<Option, 'option_id'>
): Promise<Option> => {
  const response = await axios.post<Option>(API_OPTIONS, option);
  return response.data;
};

export const addQuestion = async (
  question: Omit<Question, 'question_id'>
): Promise<Question> => {
  const response = await axios.post<Question>(API_QUESTIONS, question);
  return response.data;
};

export const addEvaluation = async (
  evaluation: Omit<Evaluation, 'evaluation_id'>
): Promise<Evaluation> => {
  const response = await axios.post<Evaluation>(API_EVALUATIONS, evaluation);
  console.log(response.data);

  return response.data;
};

export const updateEvaluation = async (
  evaluation: Evaluation,
  questions: Question[]
): Promise<void> => {
  try {
    await axios.put(`${API_EVALUATIONS}/${evaluation.evaluation_id}`, {
      evaluation,
      questions,
    });
  } catch (error: any) {
    console.error('Error al actualizar la evaluación:', error.message);
    if (error.response) {
      console.error('Detalles del error:', error.response.data);
      throw new Error(
        `Error en la solicitud de actualización: ${error.response.data.message}`
      );
    } else {
      throw new Error(
        'Error en la solicitud de actualización: El servidor respondió con un error, pero no proporcionó un mensaje específico.'
      );
    }
  }
};

export const deleteEvaluation = async (id: number): Promise<void> => {
  await axios.delete(`${API_EVALUATIONS}/${id}`);
};
