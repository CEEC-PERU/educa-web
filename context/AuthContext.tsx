import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
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
import { toast } from "sonner";
const AuthContext = createContext<AuthContextData>({} as AuthContextData);
const socket =
  typeof window !== "undefined"
    ? io(API_SOCKET_URL, {
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 10000,
      })
    : null;

let hasLoggedSocketError = false;

socket?.on("connect", () => {
  hasLoggedSocketError = false;
});

socket?.on("connect_error", (err) => {
  if (hasLoggedSocketError) return;
  hasLoggedSocketError = true;
  console.warn("No se pudo conectar con Socket.IO:", err.message);
});

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
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

  const refreshProfile = useCallback(async (token: string, userId: number): Promise<Profile | null> => {
    try {
      if (localStorage.getItem("userToken") !== token) return null;
      const profile = (await getProfile(token, userId)) as Profile | null;
      // Ignore a response from an older request if another account logged in meanwhile.
      if (localStorage.getItem("userToken") !== token) return null;
      if (profile) {
        localStorage.setItem("profileInfo", JSON.stringify(profile));
        setProfileInfo(profile);
      } else {
        localStorage.removeItem("profileInfo");
        setProfileInfo(null);
      }
      return profile;
    } catch (error) {
      console.error("Error refreshing profile:", error);
      throw error;
    }
  }, []);

  const login = async (dni: string, password: string) => {
    setIsLoading(true);
    setError(null);
    setUser(null);
    setToken(null);
    setProfileInfo(null);
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("profileInfo");
    delete axios.defaults.headers.common["Authorization"];
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
        try {
          const profile = await refreshProfile(response.token, decodedToken.id);
          if (profile) {
            redirectToDashboard(decodedToken.role, response.token);
          } else {
            redirectToProfile(decodedToken.role);
          }
        } catch {
          // La autenticación ya fue confirmada; no devolver al usuario al login
          // por un fallo temporal al cargar los datos de perfil.
          toast.warning("Sesión iniciada. No se pudo cargar el perfil; se volverá a intentar desde la plataforma.");
          redirectToDashboard(decodedToken.role, response.token);
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
    delete axios.defaults.headers.common["Authorization"];
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

  const completePasswordChange = (updatedToken?: string) => {
    if (updatedToken) {
      setToken(updatedToken);
      localStorage.setItem("userToken", updatedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${updatedToken}`;
    }
    setUser((current) => {
      if (!current) return current;
      const updated = { ...current, must_change_password: false };
      localStorage.setItem("userInfo", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    let cancelled = false;

    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const storedUserToken = localStorage.getItem("userToken");
        const isValid = storedUserToken ? await validateToken(storedUserToken) : false;

        if (cancelled) return;

        if (storedUserToken && isValid) {
          const decodedToken = jwtDecode<{
            id: number;
            role: number;
            enterprise_id: number;
            must_change_password?: boolean;
          }>(storedUserToken);
          if (!Number.isInteger(decodedToken.id) || decodedToken.id <= 0) {
            throw new Error("Token de usuario inválido");
          }

          const safeUser = {
            id: decodedToken.id,
            role: decodedToken.role,
            enterprise_id: decodedToken.enterprise_id,
            must_change_password: Boolean(decodedToken.must_change_password),
          };
          setToken(storedUserToken);
          setUser(safeUser);
          localStorage.setItem("userInfo", JSON.stringify(safeUser));

          // Nunca hidratar identidad personal desde una caché sin vínculo con el token.
          try {
            await refreshProfile(storedUserToken, decodedToken.id);
          } catch {
            if (!cancelled) {
              setProfileInfo(null);
              localStorage.removeItem("profileInfo");
            }
          }
        } else {
          localStorage.removeItem("userToken");
          localStorage.removeItem("userInfo");
          localStorage.removeItem("profileInfo");
          delete axios.defaults.headers.common["Authorization"];
          setToken(null);
          setUser(null);
          setProfileInfo(null);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (!cancelled) {
          localStorage.removeItem("userToken");
          localStorage.removeItem("userInfo");
          localStorage.removeItem("profileInfo");
          setToken(null);
          setUser(null);
          setProfileInfo(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void initializeAuth();
    return () => {
      cancelled = true;
    };
  }, []);

  const redirectToDashboard = (role: number, accessToken?: string) => {
    const sessionToken = accessToken ?? token;
    switch (role) {
      case 1:
        router.push("/student");
        if (sessionToken) {
          const decodedToken: {
            id: number;
            role: number;
            email: string;
            client_id: number;
          } = jwtDecode(sessionToken);
          if (decodedToken.role === 1) {
            socket?.emit("login", { userToken: sessionToken });
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
