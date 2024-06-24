import axios from 'axios';
import { API_GET_COURSESTUDENT } from '../utils/Endpoints';
import { CourseStudent } from '../interfaces/CourseStudent';

export const getCourseStudent = async (userToken: string, userId: number): Promise<CourseStudent | null> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const response = await axios.get<CourseStudent>(`${API_GET_COURSESTUDENT}/${userId}`, config);
    if (response.data) {
      return response.data; 
    } else {
      console.warn('No enterprise found for user:', userId);
      return null; 
    }
  } catch (error) {
    console.error('Error getting enterprise:', error);
    throw new Error('Error getting enterprise');
  }
};
