import axios from 'axios';
import {  API_DASHBOARD} from '../utils/Endpoints';
import { CourseProgress , TopRanking , AverageTime} from '../interfaces/dashboard';

export const fetchCourseProgress = async (courseId?: number, enterpriseId?: number): Promise<CourseProgress[]> => {
  const response = await axios.get(`${API_DASHBOARD}/course-progress/${courseId}/${enterpriseId}`);
  return response.data;
};

export const fetchTopRankig = async (courseId?: number, enterpriseId?: number): Promise<TopRanking[]> => {
  const response = await axios.get(`${API_DASHBOARD}/top-advisors/${courseId}/${enterpriseId}`);
  return response.data;
};

export const fetchAverageTime = async ( enterpriseId?: number): Promise<AverageTime[]> => {
  const response = await axios.get(`${API_DASHBOARD}/averagetime/${enterpriseId}`);
  return response.data;
};

