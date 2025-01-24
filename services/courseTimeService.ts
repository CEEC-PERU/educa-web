import axios from 'axios';
import {CourseTime , CourseTimeEnd} from '../interfaces/CourseTime';
import { API_COURSETIME} from '../utils/Endpoints';
export const createCourseTime = async ( userToken : string , course_time: CourseTime) => {
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


export const createCourseTimeEndTime = async ( userToken : string , course_time_end: CourseTimeEnd) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };
      // Hacer la solicitud POST al API de UserProgress
      const response = await axios.post(`${API_COURSETIME}/close`, course_time_end, config);
      return response.data;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw new Error('Error creating profile');
    }
};
