import axios from './axios';
import { Session } from '../interfaces/Session';
import { API_SESSIONS } from '../utils/Endpoints';

export const getSessions = async (): Promise<Session[]> => {
  const response = await axios.get<Session[]>(API_SESSIONS);
  return response.data;
};

export const getSession = async (sessionId: string): Promise<Session> => {
  const response = await axios.get<Session>(`${API_SESSIONS}/${sessionId}`);
  return response.data;
};

export const addSession = async (sessionData: Partial<Session>): Promise<Session> => {
  const response = await axios.post(API_SESSIONS, sessionData);
  return response.data;
};

export const updateSession = async (sessionId: string, sessionData: Partial<Session>): Promise<void> => {
  await axios.put(`${API_SESSIONS}/${sessionId}`, sessionData);
};

export const deleteSession = async (sessionId: number): Promise<void> => {
  await axios.delete(`${API_SESSIONS}/${sessionId}`);
};
