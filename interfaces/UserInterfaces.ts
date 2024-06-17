export interface LoginResponse {
    code?: number;
    msg?: string;
    token?: string;
    possibleAttemps?: number
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface User {
    user_id: number;
    email: string;
    role_id: number;
    client_id: number;
    expired_at?: null;
    created_at?: Date;
    updated_at?: Date;
}

export interface UserInfo {
    id?: number;
    dni: string;
    role_id: number;
    enterprise_id : number;
    Profile?: Profile
}

export interface Profile {
       profile_id: number;
    first_name : string;
    last_name : string;
    user_id: number;
    phone? : string;
    profile_picture? : string;
    email?: string;
}