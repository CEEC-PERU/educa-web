import axios from 'axios';
import { API_GET_DETAILCOURSE } from '../utils/Endpoints';
import { CourseDetail } from '../interfaces/CourseDetail';

export const getCourseDetail = async (userToken: string, courseId: number): Promise<CourseDetail| null> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const response = await axios.get<CourseDetail>(`${API_GET_DETAILCOURSE}/${courseId}`, config);
    if (response.data) {
      return response.data; 
    } else {
      console.warn('No enterprise found for user:', courseId);
      return null; 
    }
  } catch (error) {
    console.error('Error getting enterprise:', error);
    throw new Error('Error getting enterprise');
  }
};
