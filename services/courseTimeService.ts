import axios from 'axios';
import { CourseTime, CourseTimeEnd } from '../interfaces/Courses/CourseTime';
import { API_COURSETIME } from '../utils/Endpoints';
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

export const getCourseTime = async (
  course_id: number,
  role_id: number,
  enterprise_id: number
) => {
  try {
    const response = await axios.get(
      `${API_COURSETIME}/average-time/${course_id}/${role_id}/${enterprise_id}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching course time:', error);
    throw new Error('Error fetching course time');
  }
};
