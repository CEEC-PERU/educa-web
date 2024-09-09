import axios from 'axios';
import { Shift } from '../interfaces/Classroom';
import {API_SHIFTS} from '../utils/Endpoints';

export const getShifts = async (): Promise<Shift[]> => {
  const response = await axios.get(`${API_SHIFTS}`);
  return response.data;
};
