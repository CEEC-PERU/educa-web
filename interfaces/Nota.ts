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
  
  export interface UserNota {
    user_id: number;
    enterprise_id: number;
    role_id: number;
    userProfile: UserProfile;
    CourseResults: CourseResult[];
    ModuleResults: ModuleResult[];
  }
  