import axios from './axios';
import { Course} from '../interfaces/Course';
import { Module } from '../interfaces/Module';
import { API_COURSES} from '../utils/Endpoints';

export const getCourses = async (): Promise<Course[]> => {
  const response = await axios.get<Course[]>(API_COURSES);
  return response.data;
};

export const getCourse = async (id: string): Promise<Course> => {
  const response = await axios.get<Course>(`${API_COURSES}/${id}`);
  return response.data;
};

export const addCourse = async (course: Omit<Course, 'course_id' | 'created_at' | 'updated_at'>): Promise<void> => {
    await axios.post(API_COURSES, course);
};

export const updateCourse = async (id: string, course: Omit<Course, 'course_id' | 'created_at' | 'updated_at'>): Promise<void> => {
    await axios.put(`${API_COURSES}/${id}`, course);
  };

export const deleteCourse = async (id: string): Promise<void> => {
  await axios.delete(`${API_COURSES}/${id}`);
};

export const getModulesByCourseId = async (courseId: number): Promise<Module[]> => {
  const response = await axios.get<Module[]>(`${API_COURSES}/${courseId}/modules`);
  return response.data;
};