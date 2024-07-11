import axios from 'axios';
import { API_GET_DETAILCOURSE, API_GET_MODULESDETAIL } from '../utils/Endpoints';
import { CourseDetail } from '../interfaces/CourseDetail';
import { Course } from '../interfaces/StudentModule';


export const getCourseDetail = async (userToken: string, courseId: number): Promise<CourseDetail| null> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const response = await axios.get<CourseDetail>(`${API_GET_DETAILCOURSE}/${courseId}`, config);
    if (response.data) {
      return response.data; 
    } else {
      console.warn('No enterprise found for user:', courseId);
      return null; 
    }
  } catch (error) {
    console.error('Error getting enterprise:', error);
    throw new Error('Error getting enterprise');
  }
};


export const getModuleDetail = async (userToken: string, courseId: number , user_id :number): Promise<Course| null> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const response = await axios.get<Course>(`${API_GET_MODULESDETAIL}/${courseId}/${user_id}`, config);
    if (response.data) {
      return response.data; 
    } else {
      console.warn('No enterprise found for user:', courseId);
      return null; 
    }
  } catch (error) {
    console.error('Error getting enterprise:', error);
    throw new Error('Error getting enterprise');
  }
};
