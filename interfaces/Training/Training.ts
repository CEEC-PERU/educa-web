//creación de programas de capacitación
export interface TrainingCreateFormData {
  enterprise_id: number;
  title: string;
  description: string;
  total_days: number;
  created_by: number;
}

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

// Update de programa de capacitación
export interface UpdateTrainingProgramData {
  title?: string;
  description?: string;
}
