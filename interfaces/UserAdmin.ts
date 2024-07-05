export interface Profile {
  first_name: string;
  last_name: string;
  profile_picture: string;
}

export interface User {
  user_id: number;
  user_name: string;
  dni: string;
  enterprise_id: number;
  password: string;
  role_id: number;
  expired_at: Date;
  failed_login_attempts: number;
  last_failed_login: Date | null;
  is_blocked: boolean;
  created_at: Date;
  updated_at: Date;
  userProfile?: Profile; // Añade esta línea
}

export interface Role {
    role_id: number;
    name: string;
    description: string;
}
  