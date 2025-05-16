export interface Course {
  course_id: number;
  name: string;
  description_short: string;
  description_large: string;
  duration_course: string;
  duration_video: string; // Añadido basado en el modelo
  intro_video: string;
  image: string;
  category_id: number;
  professor_id: number;
  evaluation_id:number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  category_id: number;
  name: string;
}

export interface Professor {
  professor_id: number;
  full_name: string;
}
