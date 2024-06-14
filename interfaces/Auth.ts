export interface User {
    id: number;
    role: number;
    dni: string;
    enterprise_id: number;
    loginTime: string;
    iat: number;
    exp: number;
  }
  
  export interface AuthContextData {
    user: User | null;
    token: string | null;
    login: (dni: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading?: boolean;
    error?: string | null;
  }
  
  export interface AuthProviderProps {
    children: React.ReactNode;
  }
  