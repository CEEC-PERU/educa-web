import { http } from "@/lib/http/client";
import { API_COURSES, API_GET_COURSESTUDENT_SUPERVISOR } from "@/utils/Endpoints";
import type { Course } from "@/interfaces/Courses/Course";
import type { Module } from "@/interfaces/Module";
import type { SupervisorCourse } from "@/interfaces/Courses/SupervisorCourse";

export type CourseDraft = Omit<
  Course,
  "course_id" | "created_at" | "updated_at"
>;

export type CreateCourseInput = {
  course: CourseDraft;
  videoFile: File;
  imageFile: File;
  presentationVideoFile?: File;
};

function toFormData({
  course,
  videoFile,
  imageFile,
  presentationVideoFile,
}: CreateCourseInput): FormData {
  const formData = new FormData();
  Object.entries(course).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    formData.append(key, String(value));
  });
  formData.append("video", videoFile);
  formData.append("image", imageFile);
  if (presentationVideoFile) {
    formData.append("presentation_video", presentationVideoFile);
  }
  return formData;
}

export async function fetchCourses(): Promise<Course[]> {
  const { data } = await http.get<Course[]>(API_COURSES);
  return data;
}

export async function fetchCourse(id: string | number): Promise<Course> {
  const { data } = await http.get<Course>(`${API_COURSES}/${id}`);
  return data;
}

export async function fetchModulesByCourseId(
  courseId: number,
): Promise<Module[]> {
  const { data } = await http.get<Module[]>(
    `${API_COURSES}/${courseId}/modules`,
  );
  return data;
}

export type PublicSyllabusModule = {
  module_id: number;
  name: string;
  is_active: boolean;
  moduleSessions: { session_id: number; name: string }[];
};

export async function fetchPublicCourseSyllabus(
  courseId: number,
): Promise<PublicSyllabusModule[]> {
  const { data } = await http.get<PublicSyllabusModule[]>(
    `${API_COURSES}/${courseId}/syllabus`,
  );
  return data;
}

export async function createCourse(input: CreateCourseInput): Promise<void> {
  await http.post(API_COURSES, toFormData(input), {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function updateCourse(
  id: string | number,
  course: CourseDraft,
): Promise<void> {
  await http.put(`${API_COURSES}/${id}`, course);
}

export async function deleteCourse(id: string | number): Promise<void> {
  await http.delete(`${API_COURSES}/${id}`);
}

export async function fetchCoursesBySupervisor(userId: number): Promise<SupervisorCourse[]> {
  const { data } = await http.get<SupervisorCourse[]>(
    `${API_GET_COURSESTUDENT_SUPERVISOR}/supervisor/${userId}`,
  );
  return data;
}
