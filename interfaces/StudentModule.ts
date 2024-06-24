
export interface Option{
    option_id : number,
    option_text : string,
    is_correct : boolean
}

export interface QuestionType{
    type_id : number,
    name : string
}

export interface Question{
   question_id : number,
    image: string,
   question_text:string,
   type_id : number,
   score : number,
   questionType: QuestionType;
   options : Option[]
}

export interface ModuleEvalution{
    evaluation_id : number,
    name : string,
    description : string,
    questions : Question[]
}

export interface UserSessionProgress{
   is_completed: boolean,
   progress: number,
   user_id : number,
}

export interface ModuleSessions{
  session_id : number,
  name : string,
  video_enlace : string,
  duracion_minutos : number,
  usersessionprogress :  UserSessionProgress[],
moduleEvaluation : ModuleEvalution[]
}

export interface UserModuleProgress{
    is_completed : boolean,
    progress: number,
    user_id : number,
  }

export interface CourseModules{
   name : string, 
   is_active : boolean,
   module_id : number,
   evaluation_id : number , 
   usermoduleprogress : UserModuleProgress[],
   moduleSessions : ModuleSessions[]
}

export interface Evaluation{
    evaluation_id : number,
    name : string,
    description : string,
    questions : Question[]
 }

export interface StudentModule{
  course_id : number,
  name : string,
  evaluation_id : number,
  courseModules : CourseModules[],
  Evaluation : Evaluation
}