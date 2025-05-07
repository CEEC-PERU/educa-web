

export interface UserProfile {
    first_name: string;
    last_name: string;
  }
  
 export  interface Course {
    course_id: number;
    name: string;
  }
  
 export  interface CourseResult {
    course_id: number;
    puntaje: number;
    course_result_id: number;
    created_at: string;
    Course: Course;
  }
  
  export interface ModuleResultDetails {
    puntaje: string;
    created_at: string;
  }
  
  export interface ModuleResult {
    module_id: number;
    module_name: string;
    results: ModuleResultDetails[];
  }

  export interface CourseStudents {
    course_id: number;
    created_at:Date;
    progress: number;
    finished_date: Date;
    deadline: Date;
  }
  
  export interface UserNota {
    user_id: number;
    enterprise_id: number;
    role_id: number;
    userProfile: UserProfile;
    CourseStudents : CourseStudents[];
    CourseResults: CourseResult[];
    ModuleResults: ModuleResult[];
    totalSessions :number;
  }

