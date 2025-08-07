import axios from './../axios';
import { API_STUDENT_EVALUATION , API_EVALUATIONS_R } from '../../utils/Endpoints';
import {
  ApiAssignment,
  ApiEvaluation,
  Evaluation,
} from '../../interfaces/EvaluationModule/Evaluation';
import { EvaluationAssignment } from '../../interfaces/EvaluationModule/EvaluationStudent';
import { EvaluationAttemptsResponse } from '../../interfaces/EvaluationModule/EvaluationStudentAttempt';

export const getCuestionarioByUser = async (
  evaluationId: number
): Promise<EvaluationAssignment[]> => {
  // Cambiado a array
  try {
    const response = await axios.get<EvaluationAssignment[]>( // Cambiado a array
      `${API_STUDENT_EVALUATION}/${evaluationId}/students`
    );
    if (response.data) {
      return response.data;
    } else {
      return []; // Devolver array vacío en lugar de null
    }
  } catch (error) {
    console.error('Error getting evaluation assignments:', error);
    throw new Error('Error getting evaluation assignments');
  }
};

//Detalle de evaluaciones de estudiante
export const getEvaluationAttemptsStudent = async (
  userId: number,
  evaluationId: number
): Promise<EvaluationAttemptsResponse> => {
  try {
    const response = await axios.get<EvaluationAttemptsResponse>(
      `${API_EVALUATIONS_R}/scheduled/results/${userId}/${evaluationId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching evaluation attempts:', error);
    throw new Error('Failed to fetch evaluation attempts');
  }
};

//Obtener evaluaciones asignadas al estudiante
export const getStudentEvaluations = async (userId: number): Promise<ApiAssignment[]> => {
  try {
    const response = await axios.get<ApiAssignment[]>(
      `${API_EVALUATIONS_R}/evaluations/assignment/student/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching student evaluations:', error);
    throw new Error('Error al cargar evaluaciones');
  }
};

// Servicio para formatear fechas (Principio de Responsabilidad Única)
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Servicio para calcular colores de puntuación (Principio de Responsabilidad Única)
export const getScoreColors = (percentage: number) => {
  if (percentage >= 80) return { text: 'text-green-600', bg: 'bg-green-50 border-green-200' };
  if (percentage >= 70) return { text: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' };
  if (percentage >= 60) return { text: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' };
  return { text: 'text-red-600', bg: 'bg-red-50 border-red-200' };
  };

  // Nuevas funciones para la lista de evaluaciones
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'overdue':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const canTakeEvaluation = (evaluation: Evaluation): boolean => {
  return evaluation.total_attempts < evaluation.max_attempts;
};