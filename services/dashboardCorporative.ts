import axios from 'axios';
import {  API_DASHBOARD} from '../utils/Endpoints';
import { CourseProgress } from '../interfaces/dashboard';

export const fetchCourseProgress = async (courseId?: number, enterpriseId?: number): Promise<CourseProgress[]> => {
  const response = await axios.get(`${API_DASHBOARD}/course-progress/${courseId}/${enterpriseId}`);
  return response.data;
};
