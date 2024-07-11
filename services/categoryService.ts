import axios from './axios';
import { Category } from '../interfaces/Category';
import { API_CATEGORIES } from '../utils/Endpoints';

export const getCategories = async (): Promise<Category[]> => {
  const response = await axios.get<Category[]>(API_CATEGORIES);
  return response.data;
};

export const addCategory = async (name: string): Promise<{ newCategory: Category }> => {
  const response = await axios.post<{ newCategory: Category }>(API_CATEGORIES, { name });
  return response.data;
};

export const deleteCategory = async (category_id: number): Promise<void> => {
  await axios.delete(`${API_CATEGORIES}/${category_id}`);
};

export const getCategory = async (category_id: number): Promise<Category> => {
  const response = await axios.get<Category>(`${API_CATEGORIES}/${category_id}`);
  return response.data;
};

export const updateCategory = async (category_id: number, category: Category): Promise<Category> => {
  const response = await axios.put<Category>(`${API_CATEGORIES}/${category_id}`, category);
  return response.data;
};
