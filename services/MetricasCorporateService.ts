import axios from 'axios';
import { API_GET_COUNT_COURSE_CORPORATE } from '../utils/Endpoints';
import {DonutChartData } from '../interfaces/Metricas';


export const getCountCourseCorporate = async (userToken: string, enterpriseId: number): Promise<DonutChartData| null> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const response = await axios.get<DonutChartData>(`${API_GET_COUNT_COURSE_CORPORATE}/${enterpriseId}`, config);
    if (response.data) {
      return response.data; 
    } else {
      console.warn('No enterprise found for user:', enterpriseId);
      return null; 
    }
  } catch (error) {
    console.error('Error getting enterprise:', error);
    throw new Error('Error getting enterprise');
  }
};
