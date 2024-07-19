export interface UserSessionProgress {
  user_session_p: number;
  user_id: number;
  session_id: number;
  is_completed: boolean;
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface Option {
  option_id: number;
  option_text: string;
  is_correct: boolean;
}

export interface QuestionType {
  type_id: number;
  name: string;
}

export interface Question {
  question_id: number;
  question_text: string;
  score: number;
  image: string;
  evaluation_id: number;
  type_id: number;
  questionType: QuestionType;
  options: Option[];
}

export interface UserModuleProgress {
  user_module_progress_id: number;
  is_completed: boolean;
  progress: number;
  user_id: number;
}

export interface ModuleSessions {
  session_id: number;
  name: string;
  video_enlace: string;
  duracion_minutos: string;
  usersessionprogress: UserSessionProgress[];
}

export interface EvaluationResult{
  name : string;
}

export interface ModuleEvaluation {
  evaluation_id: number;
  name: string;
  description: string;
  questions: Question[];
}

export interface EvaluationResult{
  name : string,
  description : string,
  evaluation_id : number
}

export interface ModuleResults{
  module_id : number,
  puntaje : number,
  user_id : number
  evaluation_id : number,
  Evaluation : EvaluationResult
}

export interface CourseModule {
  name: string;
  is_active: boolean;
  created_at:Date;
  module_id: number;
  evaluation_id: number;
  usermoduleprogress: UserModuleProgress[];
  moduleSessions: ModuleSessions[];
  moduleEvaluation: ModuleEvaluation;
  ModuleResults :ModuleResults[];
}

export interface CourseEvaluation {
  evaluation_id: number;
  name: string;
  description: string;
  questions: Question[];
}

export interface Course {
  course_id: number;
  name: string;
  evaluation_id: number;
  courseModules: CourseModule[];
  Evaluation: CourseEvaluation;
}
