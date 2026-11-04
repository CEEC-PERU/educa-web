import { Profile, UserInfo } from './User/UserInterfaces';

export interface AuthContextData {
  user?:
    | {
        id: number;
        role: number;
        enterprise_id: number;
        must_change_password: boolean;
      }
    | string
    | null;
  token?: string | null;
  login: (dni: string, password: string) => any;
  logout: () => void;
  isLoading?: boolean;
  error?: string | null;
  resetInactivityTimer: () => void;
  redirectToDashboard: (role: number) => void;
  profileInfo?: Profile | null | UserInfo;
  refreshProfile: (token: string, userId: number) => Promise<void>; // Anadido aqui
  completePasswordChange: () => void;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
