import axios from './../axios';
import { API_STUDENT_EVALUATION } from '../../utils/Endpoints';
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
      `/evaluations/scheduled/results/${userId}/${evaluationId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching evaluation attempts:', error);
    throw new Error('Failed to fetch evaluation attempts');
  }
};
