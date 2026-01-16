// Respuesta que recibo al crear el programa
export interface TrainingProgram {
  program_id: number;
  enterprise_id: number;
  title: string;
  description: string;
  total_days: number;
  created_by: number;
  created_at: string;
  updated_at: string;
}

// Días
export interface TrainingDay {
  day_id: number;
  program_id: number;
  day_number: number;
  title: string;
  description: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

// Contenido
export interface TrainingContent {
  content_id: number;
  day_id: number;
  title: string;
  content_type: 'scorm' | 'video' | 'pdf' | 'audio';
  s3_key: string;
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
}

export interface UpdateProgramData {
  title?: string;
  description?: string;
}
