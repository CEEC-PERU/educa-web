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
  assignmentId: number;
  programId: number;
  programTitle: string;
  classroomId: number;
  classroomCode: string;
  isActive: boolean;
  assignedAt: string;
}

// Estudiantes asignados
export interface StudentClassroom {
  id: number;
  name: string;
}

export interface StudentProgress {
  total_contents: number;
  completed_contents: number;
  progress_percentage: number;
}

export interface StudentAssignment {
  student_id: number;
  dni: string;
  classroom: StudentClassroom;
  progress: StudentProgress;
}

// Campaña
export interface Classroom {
  classroom_id: number;
  code: string;
  enterprise_id?: number;
}

// ===================== STUDENT ============

export interface MyProgram {
  program_id: number;
  title: string;
  description: string;
  classroom: Classroom;
  total_days: number;
}

export interface MyProgramContent {
  content_id: number;
  title: string;
  content_type: 'scorm' | 'video' | 'pdf' | 'audio';
  s3_key: string;
  order_index: number;
  is_mandatory: boolean;
  progress_percentage: string;
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface MyProgramDay {
  day_id: number;
  day_number: number;
  title: string;
  is_unlocked: boolean;
  completion_percentage: number;
  contents: MyProgramContent[];
}

export interface MyProgramApiResponse {
  success: boolean;
  data: MyProgram[];
}

export interface MyProgramDetails {
  program_id: number;
  title: string;
  description: string;
  overall_progress: number;
  days: MyProgramDay[];
}
