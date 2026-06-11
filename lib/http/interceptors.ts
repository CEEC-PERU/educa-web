import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { getAuthToken } from "./token";
import { toAppError } from "./error";
import { emit } from "./events";

export function attachAuthInterceptor(instance: AxiosInstance): void {
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  });
}

export function attachErrorInterceptor(instance: AxiosInstance): void {
  instance.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      const appError = toAppError(error);

      if (appError.status === 401) {
        emit("auth:unauthorized", { error: appError });
      }

      return Promise.reject(appError);
    },
  );
}
