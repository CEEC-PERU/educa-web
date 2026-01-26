// Respuesta que recibo al crear el programa
export interface TrainingProgram {
  program_id: number;
  enterprise_id: number;
  title: string;
  description: string;
  total_days: number;
  created_by: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Días
export interface TrainingDay {
  day_id: number;
  program_id: number;
  day_number: number;
  title: string;
  completion_threshold: number;
  order_index: number;
}

// Contenido
export interface TrainingContent {
  content_id: number;
  day_id: number;
  title: string;
  content_type: 'scorm' | 'video' | 'pdf' | 'audio';
  s3_key: string;
  is_mandatory: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

// Crear programa de formación
export interface CreateProgramData {
  enterprise_id: number;
  title: string;
  description: string;
  total_days: number;
  created_by: number;
  is_active: boolean;
}

export interface UpdateProgramData {
  title?: string;
  description?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface UserInfo {
  id: number;
  enterprise_id: number;
  dni: string;
  role: number;
}

// Asignación de programa
export interface TrainingAssignment {
  /*
  assignment_id: number;
  program_id: number;
  classroom_id: number;
  assigned_by: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;*/

  assignmentId: number;
  programId: number;
  programTitle: string;
  classroomId: number;
  classroomCode: string;
  isActive: boolean;
  assignedAt: string;
}

// Campaña
export interface Classroom {
  classroom_id: number;
  code: string;
  enterprise_id: number;
}

// ===================== STUDENT ============

export interface Progress {
  completed_contents: number;
  progress_percentage: number;
}

export interface MyProgramsResponse {
  program_id: number;
  title: string;
  description: string;
  total_days: number;
  progress: Progress;
}

export interface MyProgramApiResponse {
  success: boolean;
  data: MyProgramsResponse[];
}
