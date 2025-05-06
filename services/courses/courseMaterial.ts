import axios from '../axios';
import {CourseMaterial} from '../../interfaces/Courses/courseMaterial';
import { API_MATERIALS } from '../../utils/Endpoints';

export const getCourseMaterials = async (course_id :number ): Promise<CourseMaterial> => {
  const response = await axios.get<CourseMaterial>(`${API_MATERIALS}/course/${course_id}`);
  return response.data;
};
