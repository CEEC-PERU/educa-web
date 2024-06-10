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
    login: (dni: string, password: string) => Promise<void>;
    logout: () => void;
  }
  
  export interface AuthProviderProps {
    children: React.ReactNode;
  }
  