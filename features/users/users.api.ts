import { http } from "@/lib/http/client";
import {
  API_USER,
  API_USERU,
  API_USERCOUNT,
} from "@/utils/Endpoints";
import type { StudentData } from "@/interfaces/User/UsuariosSupervisor";
import type { UserCount } from "@/interfaces/User/UserCount";

export async function fetchClassroomStudents(
  userId: number,
  enterpriseId: number,
): Promise<StudentData> {
  const { data } = await http.get<StudentData>(
    `${API_USER}/classrooms/users/${userId}/company/${enterpriseId}`,
  );
  return data;
}

export async function fetchUserCount(
  enterpriseId: number,
): Promise<UserCount> {
  const { data } = await http.get<UserCount>(
    `${API_USERCOUNT}/${enterpriseId}`,
  );
  return data;
}

export async function createUser(userData: Record<string, unknown>): Promise<void> {
  await http.post(`${API_USER}/create`, userData);
}

export async function deleteUser(userId: number): Promise<void> {
  await http.delete(`${API_USERU}/users/${userId}`);
}
