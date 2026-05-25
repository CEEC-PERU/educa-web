import { http } from "@/lib/http/client";
import { API_CATEGORIES } from "@/utils/Endpoints";
import type { Category } from "@/interfaces/Category";

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await http.get<Category[]>(API_CATEGORIES);
  return data;
}

export async function fetchCategory(categoryId: number): Promise<Category> {
  const { data } = await http.get<Category>(`${API_CATEGORIES}/${categoryId}`);
  return data;
}

export async function createCategory(name: string): Promise<Category> {
  const { data } = await http.post<{ newCategory: Category }>(API_CATEGORIES, {
    name,
  });
  return data.newCategory;
}

export async function updateCategory(
  categoryId: number,
  category: Category,
): Promise<Category> {
  const { data } = await http.put<Category>(
    `${API_CATEGORIES}/${categoryId}`,
    category,
  );
  return data;
}

export async function deleteCategory(categoryId: number): Promise<void> {
  await http.delete(`${API_CATEGORIES}/${categoryId}`);
}
