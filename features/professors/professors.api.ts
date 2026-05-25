import { http } from "@/lib/http/client";
import { API_PROFESSORS, API_LEVELS } from "@/utils/Endpoints";
import type { Professor, Level } from "@/interfaces/Professor";

export type ProfessorDraft = Omit<
  Professor,
  "professor_id" | "created_at" | "updated_at"
>;

export async function fetchProfessors(): Promise<Professor[]> {
  const { data } = await http.get<Professor[]>(API_PROFESSORS);
  return data;
}

export async function fetchProfessor(professorId: number): Promise<Professor> {
  const { data } = await http.get<Professor>(
    `${API_PROFESSORS}/${professorId}`,
  );
  return data;
}

export async function fetchLevels(): Promise<Level[]> {
  const { data } = await http.get<Level[]>(API_LEVELS);
  return data;
}

function professorFormData(
  professor: ProfessorDraft,
  imageFile?: File | null,
): FormData {
  const formData = new FormData();
  Object.entries(professor).forEach(([key, value]) => {
    formData.append(key, value as string | Blob);
  });
  if (imageFile) {
    formData.append("image", imageFile);
  }
  return formData;
}

export async function createProfessor(
  professor: ProfessorDraft,
  imageFile: File,
): Promise<Professor> {
  const { data } = await http.post<Professor>(
    API_PROFESSORS,
    professorFormData(professor, imageFile),
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function updateProfessor(
  professorId: number,
  professor: ProfessorDraft,
  imageFile?: File | null,
): Promise<void> {
  await http.put(
    `${API_PROFESSORS}/${professorId}`,
    professorFormData(professor, imageFile),
    { headers: { "Content-Type": "multipart/form-data" } },
  );
}

export async function deleteProfessor(professorId: number): Promise<void> {
  await http.delete(`${API_PROFESSORS}/${professorId}`);
}
