export interface Question {
  question_sche_id: number;
  evaluation_sche_id: number;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'open_ended';
  points: number;
  order_index: number;
  explanation: string;
  options: QuestionOption[];
}

export interface QuestionOption {
  option_sche_id: number;
  question_sche_id: number;
  option_text: string;
  is_correct: boolean;
  order_index: number;
}

export interface UserAnswer {
  question_id: number;
  selected_option_id?: number;
  answer_text?: string;
}

export interface EvaluationData {
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
  questions: Question[];
  attempt_id?: number;
}
