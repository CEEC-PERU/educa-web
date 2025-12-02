export interface UseCertificationResultReturn {
  //cantidad de intentos
  loading: boolean;
  error: string | null;
  attempts: CertificationAttempt[];
  selectedAttempt: CertificationAttempt | null;
  setSelectedAttempt: (attempt: CertificationAttempt) => void;
  selectAttemptById: (attemptId: number) => void;
}

export interface CertificationAnswer {
  answer_id: number;
  attempt_id: number;
  question_id: number;
  answered_at: string;
  is_correct: boolean;
  points_earned: number;
  question: CertificationQuestion;
}

export interface CertificationOption {
  option_id: number;
  option_text: string;
  is_correct: boolean;
  option_order: number;
  created_at: string;
  updated_at: string;
}

export interface CertificationQuestion {
  question_id: number;
  question_text: string;
  type_id: number;
  points_value: number;
  created_at: string;
  updated_at: string;
  options: CertificationOption[];
}

export interface CertificationAttempt {
  attempt_id: number;
  assignment_id: number;
  user_id: number;
  attempt_number: number;
  status: "in_progress" | "completed" | "abandoned";
  started_at: string;
  completed_at: string;
  submitted_at: string;
  time_spent_minutes: number;
  total_points_available: number;
  score_obtained: number;
  passed: boolean;
  created_at: string;
  updated_at: string;
  answers: CertificationAnswer[];
  certification: {
    title: string;
    description: string;
    duration_in_minutes: number;
    passing_percentage: number;
  };
}

export interface CertificationAttemptsResponse {
  success: boolean;
  data: CertificationAttempt[];
}
