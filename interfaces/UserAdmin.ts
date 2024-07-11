export interface Profile {
  first_name: string;
  last_name: string;
  profile_picture: string;
}

export interface User {
  user_id?: number;
  dni: string;
  password: string;
  role_id: number;
  enterprise_id: number;
  user_name?: string;
  expired_at?: Date;
  failed_login_attempts?: number;
  last_failed_login?: Date;
  created_at?: Date;
  updated_at?: Date;
  userProfile?: Profile; // Añade esta línea
}

export interface Role {
    role_id: number;
    name: string;
    description: string;
}
  