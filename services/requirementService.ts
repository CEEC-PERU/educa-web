import axios from 'axios';
import { Requirement } from '../interfaces/Requirement';
import { API_REQUIREMENTS } from '../utils/Endpoints';

export const createRequirement = async (requirement: FormData) => {
  const response = await axios.post(`${API_REQUIREMENTS}/`, requirement, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const updateRequirement = async (id: number, updatedFields: Partial<Requirement>) => {
  const response = await axios.put(`${API_REQUIREMENTS}/${id}`, updatedFields);
  return response.data;
};

export const getAllRequirements = async () => {
  const response = await axios.get(`${API_REQUIREMENTS}/`);
  return response.data;
};

export const getAllRequirementsbar = async () => {
  const response = await axios.get(`${API_REQUIREMENTS}/`);
  // Filtrar los requerimientos para obtener solo los activos
  const activeRequirements = response.data.filter((requirement: Requirement) => requirement.is_active);
  return activeRequirements;
};
  
export const deleteRequirement = async (id: number) => {
  await axios.delete(`${API_REQUIREMENTS}/${id}`);
};
