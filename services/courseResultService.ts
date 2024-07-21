import axios from 'axios';
import {RequestCourseResult} from '../interfaces/CourseResult';
import { API_POST_COURSE_RESULT} from '../utils/Endpoints';
export const createCourseResult = async ( userToken : string , CourseResultData: RequestCourseResult) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };
      // Hacer la solicitud POST al API de EvaluationModuleResult
      const response = await axios.post(`${API_POST_COURSE_RESULT}`,CourseResultData, config);
      return response.data;
    } catch (error) {
      console.error('Error sending courseResult:', error);
      throw new Error('Error sending courseResult');
    }
};
