import axios from 'axios';
import { API_DASHBOARD } from '../utils/Endpoints';
import {
  CourseProgress,
  TopRanking,
  AverageTime,
  ActiveUser,
  ScoreNPS,
} from '../interfaces/dashboard';

export const fetchCourseProgress = async (
  courseId?: number,
  enterpriseId?: number
): Promise<CourseProgress[]> => {
  const response = await axios.get(
    `${API_DASHBOARD}/course-progress/${courseId}/${enterpriseId}`
  );
  return response.data;
};

export const fetchTopRankig = async (
  courseId?: number,
  enterpriseId?: number
): Promise<TopRanking[]> => {
  const response = await axios.get(
    `${API_DASHBOARD}/top-advisors/${courseId}/${enterpriseId}`
  );
  return response.data;
};

export const fetchAverageTime = async (
  enterpriseId?: number
): Promise<AverageTime[]> => {
  const response = await axios.get(
    `${API_DASHBOARD}/averagetime/${enterpriseId}`
  );
  return response.data;
};

export const fetchUserActive = async (
  enterpriseId?: number
): Promise<ActiveUser[]> => {
  const response = await axios.get(
    `${API_DASHBOARD}/active-students/${enterpriseId}`
  );
  return response.data;
};

export const fetchNps = async (
  cuestypeId?: number,
  enterpriseId?: number,
  courseId?: number
): Promise<ScoreNPS[]> => {
  const response = await axios.get(
    `${API_DASHBOARD}/scores/${cuestypeId}/${enterpriseId}/${courseId}`
  );
  console.log('Response NPS:', response.data);
  return response.data;
};
