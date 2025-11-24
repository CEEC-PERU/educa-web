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
  assigned_by: number;
  start_date: string;
  due_date: string;
  is_randomized: boolean;
  questions_count?: number;
}

export interface AssignmentFormErrors {
  general?: string;
  backendDetails?: string;
  errorType?: string;
  certification_id?: string;
  classroom_ids?: string;
  start_date?: string;
  due_date?: string;
  questions_count?: string;
  is_randomized?: string;
  [key: string]: string | undefined;
}

export interface AssignmentFormProps {
  formData: AssignmentFormData;
  onFormDataChange: (data: AssignmentFormData) => void;
  availableCertifications: CertificationOption[];
  errors: AssignmentFormErrors;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export interface ApiCertification {
  certification_id: number;
  created_by: number;
  enterprise_id: number;
  title: string;
  description: string;
  instructions: string;
  duration_in_minutes: number;
  total_questions: number;
  due_date: string;
  max_attempts: number;
  passing_percentage: number;
  show_results_immediately: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiAssignment {
  assignment_id: number;
  certification_id: number;
  classroom_id: number;
  assigned_by: number;
  assignet_at: string;
  status: string;
  due_date_override: string | null;
  created_at: string;
  updated_at: string;
  certification: ApiCertification;
}
