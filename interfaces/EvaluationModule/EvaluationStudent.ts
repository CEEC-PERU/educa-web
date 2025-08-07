// Interface para el perfil del usuario
export interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  phone: number;
}

// Interface para el estudiante
export interface Student {
  user_id: number;
  dni: string;
  is_active: boolean;
  userProfile: UserProfile;
}

// Interface para un intento de evaluación
export interface EvaluationAttempt {
  attempt_id: number;
  score: number;
  completed_at: string;
  status: 'completed' | 'in_progress' | 'failed' | 'cancelled';
}

// Interface para la información de la evaluación
export interface EvaluationInfo {
  evaluation_sche_id: number;
  max_attempts: number;
  attempts: EvaluationAttempt[];
}

// Interface principal para la asignación de evaluación
export interface EvaluationAssignment {
  assignment_id: number;
  evaluation_sche_id: number;
  user_id: number;
  assigned_at: string;
  assigned_by: number;
  status: 'assigned' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
  due_date_override: string | null;
  start_date: string;
  due_date: string;
  created_at: string;
  updated_at: string;
  student: Student;
  evaluation: EvaluationInfo;
}
