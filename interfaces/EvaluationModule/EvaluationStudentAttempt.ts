// Base interfaces
export interface EvaluationOption {
  option_sche_id: number;
  question_sche_id: number;
  option_text: string;
  is_correct: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface EvaluationQuestion {
  question_sche_id: number;
  evaluation_sche_id: number;
  question_text: string;
  question_type: string;
  points: number;
  order_index: number;
  explanation: string;
  created_at: string;
  updated_at: string;
  options: EvaluationOption[];
}

export interface Evaluation {
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
  max_attempts: number;
  show_results_immediately: boolean;
  created_at: string;
  updated_at: string;
  questions: EvaluationQuestion[];
}

export interface EvaluationAnswer {
  answer_id: number;
  attempt_id: number;
  question_sche_id: number;
  option_sche_id: number;
  answer_text: string | null;
  is_correct: boolean;
  points_earned: number;
  answered_at: string;
  time_spent_seconds: number;
  created_at: string;
  updated_at: string;
}

export interface EvaluationAttempt {
  attempt_id: number;
  user_id: number;
  evaluation_sche_id: number;
  attempt_number: number;
  started_at: string;
  completed_at: string;
  submitted_at: string;
  score: number;
  percentage: string;
  time_spent_minutes: number;
  status: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  updated_at: string;
  evaluation: Evaluation;
  answers: EvaluationAnswer[];
}

export interface EvaluationAttemptsResponse {
  success: boolean;
  data: EvaluationAttempt[];
}
