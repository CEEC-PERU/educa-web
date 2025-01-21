import axios from 'axios';
import {Template } from '../interfaces/Template';
import {API_TEMPLATE} from '../utils/Endpoints';

export const getTemplates = async (): Promise<Template[]> => {
  const response = await axios.get(`${API_TEMPLATE}/questions`);
  return response.data;
};
