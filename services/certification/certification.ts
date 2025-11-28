import axios from 'axios';
import { API_STUDENT_CERTIFICATIONS } from '../../utils/Endpoints';
import { CertificationAttemptsResponse } from '../../interfaces/Certification/CertificationStudentAttempt';

export const getCertificationAttemptsStudent = async (
  userId: number,
  assignmentId: number
): Promise<CertificationAttemptsResponse> => {
  try {
    const response = await axios.get<CertificationAttemptsResponse>(
      `${API_STUDENT_CERTIFICATIONS}/assignment/${assignmentId}/user/${userId}/attempts`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching certification attempts:', error);
    throw new Error('Failed to fetch certification attempts');
  }
};
