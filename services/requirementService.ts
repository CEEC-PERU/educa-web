import axios from 'axios';
import { Requirement } from '../interfaces/Requirement';
import { API_REQUIREMENTS } from '../utils/Endpoints';

export const createRequirement = async (requirement: Requirement) => {
    const response = await axios.post(`${API_REQUIREMENTS}/`, requirement);
    return response.data;
  };
  
  export const getAllRequirements = async () => {
    const response = await axios.get(`${API_REQUIREMENTS}/`);
    return response.data;
  };
  
  export const deleteRequirement = async (id: number) => {
    await axios.delete(`${API_REQUIREMENTS}/${id}`);
  };
