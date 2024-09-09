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
  export interface Classroom {
    classroom_id: number;
    code: string;
    enterprise_id: number;
    shift_id: number;
    created_at: string;
    updated_at: string;
    Enterprise: Enterprise;
    Shift : Shift
  }

  export interface ClassroomRequest {
    code: string;
    enterprise_id: number;
    shift_id: number;
  }
  