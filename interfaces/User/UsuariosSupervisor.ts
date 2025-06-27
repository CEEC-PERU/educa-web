export interface UserProfile {
    profile_id: number;
    first_name: string;
    last_name: string;
    email: string;
    user_id: number;
    phone: number;
    profile_picture: string;
  }
  
export interface User {
    user_id: number;
    dni: string;
    role_id: number;
    enterprise_id: number;
    user_name: string | null;
    created_at: string;
    userProfile?: UserProfile; // Puede que algunos usuarios no tengan perfil
  }
  
export  interface Enterprise {
    name: string;
  }
  
  export   interface Classroom {
    code: string;
    Enterprise: Enterprise;
  }
  
  export  interface Student {
    user_id: number;
    progress: number;
    is_approved: boolean;
    classroom_id: number;
    User: User;
    Classroom: Classroom;
  }
  
  export  interface ClassroomData {
    classroom_code: string;
  }
  
  export  interface StudentData {
    supervisor: number;
    classrooms: ClassroomData[];
    students: Student[];
  }