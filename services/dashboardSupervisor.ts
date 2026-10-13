import axios from "axios";
import { API_DASHBOARD } from "../utils/Endpoints";
import type { ActiveUser, AverageTime, TopRanking } from "../interfaces/dashboard";

function authorization(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function fetchSupervisorTopAdvisors(
  token: string,
  courseId: number,
): Promise<TopRanking[]> {
  const { data } = await axios.get<TopRanking[]>(
    `${API_DASHBOARD}/supervisor/top-advisors`,
    { headers: authorization(token), params: { courseId } },
  );
  return data;
}

export async function fetchSupervisorAverageTime(
  token: string,
): Promise<AverageTime[]> {
  const { data } = await axios.get<AverageTime[]>(
    `${API_DASHBOARD}/supervisor/average-time`,
    { headers: authorization(token) },
  );
  return data;
}

export async function fetchSupervisorActiveStudents(
  token: string,
): Promise<ActiveUser[]> {
  const { data } = await axios.get<ActiveUser[]>(
    `${API_DASHBOARD}/supervisor/active-students`,
    { headers: authorization(token) },
  );
  return data;
}

export async function fetchSupervisorScores(
  token: string,
  courseId: number,
  cuestypeId: number,
): Promise<number[]> {
  const { data } = await axios.get<number[]>(
    `${API_DASHBOARD}/supervisor/scores`,
    { headers: authorization(token), params: { courseId, cuestypeId } },
  );
  return data;
}
