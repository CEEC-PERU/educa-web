import { Profile, UserInfo } from "./UserInterfaces";

  export interface AuthContextData {
    user?: {
      id: number;
      role: number;
      dni: string;
      enterprise_id: number;
    }| string |  null ;
    token?: string | null;
    login: (dni: string, password: string) => any;
    logout: () => void;
    isLoading?: boolean;
    error?: string | null;
    profileInfo?: Profile | null | UserInfo;
    refreshProfile: (token: string, userId: number) => Promise<void>; // Añadido aquí

  }
  
  export interface AuthProviderProps {
    children: React.ReactNode;
  }
  