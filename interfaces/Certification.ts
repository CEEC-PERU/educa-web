export interface Option {
  option_text: string;
  is_correct: boolean;
  option_order: number;
}

export interface Question {
  question_text: string;
  type_id: number;
  points_value: number;
  options: Option[];
}

export interface Certification {
  certification_id: number;
  title: string;
  description: string;
  instructions: string;
  duration_in_minutes: number;
  max_attempts: number;
  passing_percentage: number;
  show_results_immediately: boolean;
  is_active: boolean;
  questions: Question[];
  created_at?: string;
  total_questions?: number;
}

export interface CertificationFormData {
  title: string;
  description: string;
  instructions: string;
  duration_in_minutes: number;
  max_attempts: number;
  passing_percentage: number;
  show_results_immediately: boolean;
  is_active: boolean;
  questions: Question[];
}

export interface UserInfo {
  id: number;
  enterprise_id: number;
}