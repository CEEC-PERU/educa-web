export interface PendingCertification {
  assignment_id: number;
  certification: {
    certification_id: number;
    title: string;
    description: string;
    instructions: string;
    duration_minutes: number;
    max_attempts: number;
    passing_percentage: number;
    show_results_immediately: boolean;
  };
  classroom: {
    classroom_id: number;
    code: string;
    name: string;
    teacher: {
      name: string;
    } | null;
  };
  assignment_details: {
    start_date: string;
    due_date: string | null;
    questions_count: number;
    is_randomized: boolean;
  };
  student_progress: {
    total_attempts: number;
    latest_attempt: {
      attempt_id: number;
      attempt_number: number;
      status: string;
      score: number | null;
      passed: boolean | null;
    } | null;
    can_start_new_attempt: boolean;
    attempts_remaining: number;
  };
}

export interface ExamQuestion {
  question_id: number;
  question_text: string;
  type_id: number;
  points_value: number;
  options: {
    option_id: number;
    option_text: string;
    option_order: number;
  }[];
}

export interface ExamData {
  attempt: {
    attempt_id: number;
    attempt_number: number;
    started_at: string;
    total_points_available: number;
    passing_percentage_used: number;
  };
  exam: ExamQuestion[];
  duration_minutes: number;
  total_questions: number;
  is_resumed: boolean;
}

export interface AnswerSubmission {
  question_id: number;
  selected_option_id?: number;
  open_ended_answer?: string;
}

export interface AttemptResult {
  attempt_id: number;
  total_points_available: number;
  score_obtained: number;
  passing_percentage: number;
  passing_score: number;
  passed: boolean;
  time_spent_minutes: number;
  show_detailed_results: boolean;
  detailed_results?: {
    question_id: number;
    question_text: string;
    points_value: number;
    selected_option: {
      option_text: string;
    } | null;
    is_correct: boolean;
    points_earned: number;
  }[];
}

export interface StudentAttempt {
  attempt_id: number;
  attempt_number: number;
  status: string;
  started_at: string;
  completed_at: string | null;
  score_obtained: number | null;
  total_points_available: number;
  passed: boolean | null;
  time_spent_minutes: number | null;
}
