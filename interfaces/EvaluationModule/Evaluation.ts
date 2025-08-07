export interface ApiEvaluation {
  evaluation_sche_id: number;
  title: string;
  description: string;
  duration_minutes: number;
  total_points: number;
  passing_score: number;
  user_id: number;
  enterprise_id: number;
  is_active: boolean;
  instructions: string;
  start_date: string;
  due_date: string;
  max_attempts: number;
  show_results_immediately: boolean;
  created_at: string;
  updated_at: string;
  total_attempts: number;
  can_attempt: boolean;
  attempts_remaining: number;
}

export interface ApiAssignment {
  assignment_id: number;
  evaluation_sche_id: number;
  user_id: number;
  assigned_at: string;
  assigned_by: number;
  status: string;
  due_date_override: string | null;
  created_at: string;
  updated_at: string;
  evaluation: ApiEvaluation;
}

export interface Evaluation {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  total_points: number;
  due_date: string;
  course_name: string;
  status: 'pending' | 'completed' | 'overdue';

  max_attempts: number;
  best_score?: number;
  passing_score: number;
  instructions: string;
  total_attempts: number;
  can_attempt: boolean;
  attempts_remaining: number;
}
