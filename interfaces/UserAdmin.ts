export interface Profile {
  first_name: string;
  last_name: string;
  profile_picture: string;
}

export interface User {
  user_id?: number;
  dni: string;
  role_id: number;
  enterprise_id: number;
  user_name?: string;
  created_at?: Date;
  userProfile?: Profile; // Añade esta línea
}

export interface Role {
    role_id: number;
    name: string;
    description: string;
}
  