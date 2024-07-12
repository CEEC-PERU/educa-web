export interface UserProfile {
    first_name: string;
    last_name: string;
    profile_picture: string;
  }
  
export interface Enterprise {
  name: string;
}
  
export interface User {
  userProfile?: UserProfile;
  enterprise: Enterprise;
}
  
export interface Requirement {
  requirement_id: number;
  proposed_date: string;
  course_name: string;
  materials?: string[];
  message: string;
  course_duration: string;
  is_active:boolean;
  user: User;
}