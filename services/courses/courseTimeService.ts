import axios from 'axios';
import {
  CourseTime,
  CourseTimeEnd,
  CourseTimeAverage,
  CourseTimeSummary,
} from '../../interfaces/Courses/CourseTime';
import { API_COURSETIME } from '../../utils/Endpoints';
export const createCourseTime = async (
  userToken: string,
  course_time: CourseTime
) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    // Hacer la solicitud POST al API de UserProgress
    const response = await axios.post(`${API_COURSETIME}`, course_time, config);
    return response.data;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw new Error('Error creating profile');
  }
};

export const createCourseTimeEndTime = async (
  userToken: string,
  course_time_end: CourseTimeEnd
) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    // Hacer la solicitud POST al API de UserProgress
    const response = await axios.post(
      `${API_COURSETIME}/close`,
      course_time_end,
      config
    );
    return response.data;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw new Error('Error creating profile');
  }
};

export const getCourseTimeSummary = async (
  userToken: string,
  limit?: number
): Promise<CourseTimeSummary> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const response = await axios.get(
      `${API_COURSETIME}/summary${limit ? `?limit=${limit}` : ''}`,
      config
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching course time summary:', error);
    throw new Error('Error fetching course time summary');
  }
};

export const getCourseTimeAverage = async (
  course_id?: number,
  role_id?: number,
  enterprise_id?: number
) => {
  if (!course_id || !role_id || !enterprise_id) {
    throw new Error(
      'Parámetros incompletos para obtener el tiempo promedio del curso.'
    );
  }

  try {
    const response = await axios.get(
      `${API_COURSETIME}/average-time/${course_id}/${role_id}/${enterprise_id}`
    );
    console.log('Response average time:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching course time:', error);
    throw new Error('Error fetching course time');
  }
};
