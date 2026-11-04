import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
} from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import { getProfile } from "../services/profile";
import { signin } from "../services/authService";
import { AuthContextData, AuthProviderProps } from "../interfaces/Auth";
import { API_SOCKET_URL } from "../utils/Endpoints";
import {
  LoginResponse,
  Profile,
  UserInfo,
} from "../interfaces/User/UserInterfaces";
import { validateToken } from "../helpers/helper-token";
import { io } from "socket.io-client";
import axios from "axios";
const AuthContext = createContext<AuthContextData>({} as AuthContextData);
const socket = typeof window !== "undefined" ? io(API_SOCKET_URL) : null;

socket?.on("reconnect", () => {
  const token = localStorage.getItem("userToken");
  if (token) socket?.emit("login", { userToken: token });
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const inactivityTimeout = 45 * 60 * 1000;

  const [user, setUser] = useState<{
    id: number;
    role: number;
    enterprise_id: number;
    must_change_password: boolean;
  } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [profileInfo, setProfileInfo] = useState<Profile | UserInfo | null>(
    null,
  );
  const router = useRouter();

  const resetInactivityTimer = () => {
    setLastActivity(Date.now());
  };

  useEffect(() => {
    if (!token) return;

    const checkInactivity = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - lastActivity;

      if (elapsedTime > inactivityTimeout) {
        logout();
        router.push("/?sessionExpired=true");
      }
    };

    const interval = setInterval(checkInactivity, 60 * 1000);
    return () => clearInterval(interval);
  }, [token, lastActivity, inactivityTimeout]);

  useEffect(() => {
    if (!token) return;

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];

    const handleActivity = () => {
      resetInactivityTimer();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [token]);

  useEffect(() => {
    if (!router.isReady || !user?.must_change_password) return;
    if (router.pathname !== "/change-password") {
      router.replace("/change-password");
    }
  }, [router.isReady, router.pathname, user?.must_change_password]);

  const refreshProfile = async (token: string, userId: number) => {
    try {
      const profile = await getProfile(token, userId);
      if (profile) {
        localStorage.setItem("profileInfo", JSON.stringify(profile));
        setProfileInfo(profile);
      }
    } catch (error) {
      console.error("Error refreshing profile:", error);
    }
  };

  const login = async (dni: string, password: string) => {
    setIsLoading(true);
    try {
      const response: LoginResponse = await signin({ dni, password });
      if (response.token) {
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${response.token}`;
        const decodedToken: {
          id: number;
          role: number;
          enterprise_id: number;
          must_change_password?: boolean;
        } = jwtDecode(response.token);
        const mustChangePassword = Boolean(
          response.must_change_password ?? decodedToken.must_change_password,
        );
        setToken(response.token);
        setUser({
          id: decodedToken.id,
          role: decodedToken.role,
          enterprise_id: decodedToken.enterprise_id,
          must_change_password: mustChangePassword,
        });

        localStorage.setItem("userToken", response.token);
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            id: decodedToken.id,
            role: decodedToken.role,
            enterprise_id: decodedToken.enterprise_id,
            must_change_password: mustChangePassword,
          }),
        );
        if (decodedToken.role === 1) {
          socket?.emit("login", { userToken: response.token });
        }
        if (mustChangePassword) {
          await router.replace("/change-password");
          return;
        }
        const profile = await getProfile(response.token, decodedToken.id);
        if (profile) {
          setProfileInfo(profile);
          localStorage.setItem("profileInfo", JSON.stringify(profile));
          redirectToDashboard(decodedToken.role);
        } else {
          redirectToProfile(decodedToken.role);
        }
      } else {
        setError(
          response.msg ??
            "Hubo un problema al iniciar sesion. Por favor, intentalo de nuevo.",
        );
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 401) {
          setError("Error al iniciar sesion, datos ingresados incorrectos.");
        } else {
          setError("Ocurrio un error al iniciar sesion. Intentalo nuevamente.");
        }
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocurrio un error inesperado.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("profileInfo");
    if (token) {
      const decodedToken: {
        id: number;
        role: number;
        email: string;
        client_id: number;
      } = jwtDecode(token);
      if (decodedToken.role === 1) {
        socket?.emit("logout");
      }
    }

    setUser(null);
    setToken(null);
    router.push("/");
  };

  const completePasswordChange = () => {
    setUser((current) => {
      if (!current) return current;
      const updated = { ...current, must_change_password: false };
      localStorage.setItem("userInfo", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    try {
      const storedUserToken = localStorage.getItem("userToken");
      const storedUserInfo = localStorage.getItem("userInfo");
      const isValid = storedUserToken ? validateToken(storedUserToken) : false;

      if (storedUserInfo && isValid) {
        const storedProfileInfo = localStorage.getItem("profileInfo");
        if (storedProfileInfo) {
          setProfileInfo(JSON.parse(storedProfileInfo));
        }

        const storedUser = JSON.parse(storedUserInfo);
        const decodedToken: { must_change_password?: boolean } = jwtDecode(storedUserToken!);
        const { id, role, enterprise_id } = storedUser;
        const must_change_password = Boolean(
          storedUser.must_change_password ?? decodedToken.must_change_password,
        );

        setToken(storedUserToken);
        const safeUser = { id, role, enterprise_id, must_change_password };
        setUser(safeUser);
        localStorage.setItem("userInfo", JSON.stringify(safeUser));
      } else {
        setToken(null);
        setUser(null);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error initializing auth:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const redirectToDashboard = (role: number) => {
    switch (role) {
      case 1:
        router.push("/student");
        if (token) {
          const decodedToken: {
            id: number;
            role: number;
            email: string;
            client_id: number;
          } = jwtDecode(token);
          if (decodedToken.role === 1) {
            socket?.emit("login", { userToken: token });
          }
        }
        break;
      case 2:
        router.push("/corporate");
        break;
      case 3:
        router.push("/content");
        break;
      case 4:
        router.push("/admin");
        break;
      case 5:
        router.push("/admincorporative");
        break;
      case 6:
        router.push("/supervisor");
        break;
      case 7:
        router.push("/calidad");
        break;
      case 8:
        router.push("/comercial");
        break;
      default:
        router.push("/");
    }
  };

  const redirectToProfile = (role: number) => {
    router.push("/profile");
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      error,
      login,
      logout,
      profileInfo,
      redirectToDashboard,
      refreshProfile,
      completePasswordChange,
      resetInactivityTimer,
    }),
    [user, token, isLoading, error, profileInfo],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
