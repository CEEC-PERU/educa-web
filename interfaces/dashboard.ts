export interface CourseProgress {
  course: string;
  Estudiantes: number;
  Progreso: number;
}

export interface TopRanking {
  name: string;
  puntaje: number;
}

export interface AverageTime {
  day: string;
  time: number;
}

export interface ActiveUser {
  day: string;
  active: number;
}

export type ScoreNPS = number[];
