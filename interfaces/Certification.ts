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

export interface CertificationOption {
  certification_id: number;
  title: string;
  description: string;
  duration_in_minutes: number;
}

export interface UserOption {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  enterprise_id: number;
}

export interface AssignmentFormData {
  certification_id: number;
  classroom_ids: number[];
  start_date: string;
  due_date: string;
  is_randomized: boolean;
  questions_count?: number;
  is_active: boolean;
}

export interface AssignmentFormProps {
  formData: AssignmentFormData;
  onFormDataChange: (data: AssignmentFormData) => void;
  availableCertifications: CertificationOption[];
  errors: { [key: string]: string };
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}
