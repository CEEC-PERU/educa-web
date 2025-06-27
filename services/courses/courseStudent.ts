import axios from 'axios';

import {
  API_GET_COURSESTUDENT,
  API_GET_COURSESTUDENTS,
  API_GET_COURSESTUDENT_ENTERPRISE,
  API_GET_COURSEMODULE,
  API_POST_COURSESTUDENT,
  API_GET_COURSESTUDENT_ASSIGNED,
  API_GET_COURSESTUDENT_SUPERVISOR,
} from '../../utils/Endpoints';
import { CourseStudent } from '../../interfaces/Courses/CourseStudent';

export const getCourseStudent = async (
  userToken: string,
  userId: number
): Promise<CourseStudent | null> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const response = await axios.get<CourseStudent>(
      `${API_GET_COURSESTUDENT}/${userId}`,
      config
    );
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

export const getCourseStudentCategory = async (
  userToken: string,
  userId: number,
  categoryId: number
): Promise<CourseStudent | null> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const response = await axios.get<CourseStudent>(
      `${API_GET_COURSESTUDENT}/${userId}/category/${categoryId}`,
      config
    );
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

export const getModulesByCourseId2 = async (
  courseId: number,
  userId: number
) => {
  const response = await axios.get(
    `${API_GET_COURSEMODULE}/${courseId}/${userId}`
  );
  return response.data;
};

export const assignStudentsToCourse = async (
  enterpriseId: number,
  courseId: number
) => {
  try {
    const response = await axios.post(`${API_POST_COURSESTUDENT}`, {
      enterprise_id: enterpriseId,
      course_id: courseId,
      role_id: 2, // Asumiendo que el role_id para estudiantes es 2
    });
    return response.data;
  } catch (error) {
    console.error('Error assigning students to course:', error);
    throw new Error('Error assigning students to course');
  }
};

export const getAssignedStudents = async (course_id: number) => {
  const response = await axios.get(
    `${API_GET_COURSESTUDENT_ASSIGNED}/${course_id}`
  );
  return response.data;
};

export const getUnassignedStudents = async (
  course_id: number,
  enterprise_id: number
) => {
  try {
    const response = await axios.get(
      `${API_GET_COURSESTUDENT_ASSIGNED}/${course_id}/${enterprise_id}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching unassigned students:', error);
    throw error;
  }
};

//corporativo y calidad mismo crd de graficos
export const getCoursesByEnterpriseCalidad = async (enterpriseId: number) => {
  const response = await axios.get(
    `${API_GET_COURSESTUDENT_ENTERPRISE}/calidad/${enterpriseId}`
  );
  return response.data;
};

export const getCoursesBySupervisor = async (userId: number) => {
  const response = await axios.get(
    `${API_GET_COURSESTUDENT_SUPERVISOR}/supervisor/${userId}`
  );
  return response.data;
};

export const getUsersByEnterpriseWithSessions = async (
  startDate: string,
  endDate: string,
  enterpriseId: number
) => {
  const response = await axios.get(
    `${API_GET_COURSESTUDENT_ENTERPRISE}/users/sessions`,
    {
      params: { startDate, endDate, enterpriseId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
  return response.data;
};
// Nueva función para obtener estudiantes por empresa
export const getStudentsByEnterprise = async (enterpriseId: number) => {
  const response = await axios.get(
    `${API_GET_COURSESTUDENT_ENTERPRISE}/${enterpriseId}/students`
  );
  return response.data;
};

// Nueva función para obtener cursos y notas por estudiante
export const getCoursesWithGradesByStudent = async (userId: number) => {
  const response = await axios.get(
    `${API_GET_COURSESTUDENTS}/${userId}/grades`
  );
  return response.data;
};
