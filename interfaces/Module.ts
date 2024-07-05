import { Session } from './Session'; // Asegúrate de que existe la interfaz Session
export interface Module {
  module_id: number;
  name: string;
  course_id: number;
  evaluation_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  moduleSessions?: Session[]; 
}
