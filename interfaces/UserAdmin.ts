export interface User {
    user_id: number;
    user_name: string;
    dni: string;
    enterprise_id: number;
    role_id: number;
    name: string;
    lastName: string;
    profile: {
      first_name: string;
      last_name: string;
      email: string;
      phone: number;
      profile_picture?: string;
    };
  }

export interface Role {
    role_id: number;
    name: string;
    description: string;
}
  