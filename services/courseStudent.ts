import axios from 'axios';
import { API_GET_COURSESTUDENT, API_GET_COURSESTUDENT_ENTERPRISE, API_POST_COURSESTUDENT, API_GET_COURSESTUDENT_ASSIGNED  } from '../utils/Endpoints';
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

export const assignStudentsToCourse = async (enterpriseId: number, courseId: number) => {
  try {
    const response = await axios.post(`${API_POST_COURSESTUDENT}`, {
      enterprise_id: enterpriseId,
      course_id: courseId,
    });
    return response.data;
  } catch (error) {
    console.error('Error assigning students to course:', error);
    throw new Error('Error assigning students to course');
  }
};

export const getAssignedStudents = async (course_id: number) => {
  const response = await axios.get(`${API_GET_COURSESTUDENT_ASSIGNED}/${course_id}`);
  return response.data;
};

export const getUnassignedStudents = async (course_id: number, enterprise_id: number) => {
  try {
    const response = await axios.get(`${API_GET_COURSESTUDENT_ASSIGNED}/${course_id}/${enterprise_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching unassigned students:', error);
    throw error;
  }
};

export const getCoursesByEnterprise = async (enterpriseId: number) => {
  const response = await axios.get(`${API_GET_COURSESTUDENT_ENTERPRISE}/${enterpriseId}`);
  return response.data;
};

export const getUsersByEnterpriseWithSessions = async (startDate: string, endDate: string, enterpriseId: number) => {
  const response = await axios.get(`${API_GET_COURSESTUDENT_ENTERPRISE}/users/sessions`, {
    params: { startDate, endDate, enterpriseId },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};