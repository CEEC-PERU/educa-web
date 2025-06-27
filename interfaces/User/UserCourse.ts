export interface User {
  user_id: number;
  dni: string;
  userProfile?: {
    first_name: string;
    last_name: string;
    email: string;
    profile_picture: string;
  };
}
