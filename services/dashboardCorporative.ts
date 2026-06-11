import axios from 'axios';
import { API_DASHBOARD } from '../utils/Endpoints';
import {
  CourseProgress,
  ProgressDistribution,
  TopRanking,
  AverageTime,
  ActiveUser,
} from '../interfaces/dashboard';
import { CourseTimeAverage } from '../interfaces/Courses/CourseTime';

export const fetchCourseProgressSupervisor = async (
  token: string,
  courseId?: number
): Promise<CourseProgress[]> => {
  const response = await axios.get(`${API_DASHBOARD}/progresssupervisor`, {
    headers: { Authorization: `Bearer ${token}` },
    params: courseId !== undefined ? { courseId } : {},
  });
  return response.data;
};

export const fetchProgressDistributionSupervisor = async (
  token: string,
  courseId?: number
): Promise<ProgressDistribution[]> => {
  const response = await axios.get(`${API_DASHBOARD}/progressdistribution`, {
    headers: { Authorization: `Bearer ${token}` },
    params: courseId !== undefined ? { courseId } : {},
  });
  return response.data;
};

export const fetchCourseTimeAverageSupervisor = async (
  token: string,
  courseId?: number
): Promise<CourseTimeAverage[]> => {
  const response = await axios.get(`${API_DASHBOARD}/coursetimeaverage`, {
    headers: { Authorization: `Bearer ${token}` },
    params: courseId !== undefined ? { courseId } : {},
  });
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
): Promise<number[]> => {
  const response = await axios.get(
    `${API_DASHBOARD}/scores/${cuestypeId}/${enterpriseId}/${courseId}`
  );
  console.log('Response NPS:', response.data);
  return response.data;
};
