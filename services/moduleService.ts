import axios from './axios';
import { Module } from '../interfaces/Module';
import { API_MODULES } from '../utils/Endpoints';

export const getModules = async (): Promise<Module[]> => {
  const response = await axios.get<Module[]>(API_MODULES);
  return response.data;
};

export const getModule = async (moduleId: string): Promise<Module> => {
  const response = await axios.get<Module>(`${API_MODULES}/${moduleId}`);
  return response.data;
};
// services/moduleService.ts

export const getModuleById = async (moduleId: string): Promise<Module> => {
  const response = await fetch(`${API_MODULES}/${moduleId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch module');
  }
  
  return response.json();
};

export const addModule = async (moduleData: Partial<Module>): Promise<Module> => {
  const response = await axios.post(API_MODULES, moduleData);
  return response.data;
};

export const updateModule = async (moduleId: string, moduleData: Partial<Module>): Promise<void> => {
  await axios.put(`${API_MODULES}/${moduleId}`, moduleData);
};

export const deleteModule = async (moduleId: number): Promise<void> => {
  await axios.delete(`${API_MODULES}/${moduleId}`);
};
