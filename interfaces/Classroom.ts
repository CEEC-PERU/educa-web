export interface Enterprise {
    enterprise_id: number;
    user_count: string;
    image_log: string;
    image_fondo: string;
    name: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface Shift{
    shift_id: number;
    name: string;
    created_at: string;
    updated_at: string;
  }
 
  export interface Profile{
    first_name: string;
    last_name: string;
  }
  export interface User{
    user_id: number;
    userProfile: Profile;
  }
  export interface Classroom {
    classroom_id: number;
    code: string;
    user_id :number;
    enterprise_id: number;
    shift_id: number;
    created_at: string;
    updated_at: string;
    Enterprise: Enterprise;
    Shift : Shift
    User : User;
  }

  export interface ClassroomRequest {
    code: string;
    enterprise_id: number;
    shift_id: number;
    user_id : number;
  }
  