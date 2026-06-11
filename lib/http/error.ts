import axios, { AxiosError } from "axios";

export type AppErrorKind =
  | "auth"
  | "validation"
  | "network"
  | "server"
  | "unknown";

export type AppError = {
  status: number;
  message: string;
  code?: string;
  kind?: AppErrorKind;
  details?: unknown;
  cause?: unknown;
};

const DEFAULT_MESSAGE = "Ocurrió un error inesperado. Inténtalo nuevamente.";

function pickMessage(data: unknown, fallback: string): string {
  if (typeof data === "string" && data.trim().length > 0) return data;
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const candidates = [record.message, record.msg, record.error];
    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim().length > 0) {
        return candidate;
      }
    }
  }
  return fallback;
}

function kindFromStatus(status: number): AppErrorKind {
  if (status === 0) return "network";
  if (status === 401 || status === 403) return "auth";
  if (status === 422 || status === 400) return "validation";
  if (status >= 500) return "server";
  return "unknown";
}

export function toAppError(error: unknown): AppError {
  if (isAppError(error)) return error;

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status ?? 0;
    const data = axiosError.response?.data;
    return {
      status,
      message: pickMessage(data, axiosError.message || DEFAULT_MESSAGE),
      code: axiosError.code,
      kind: kindFromStatus(status),
      details: data,
      cause: axiosError,
    };
  }

  if (error instanceof Error) {
    return {
      status: 0,
      message: error.message || DEFAULT_MESSAGE,
      kind: "unknown",
      cause: error,
    };
  }

  return {
    status: 0,
    message: DEFAULT_MESSAGE,
    kind: "unknown",
    cause: error,
  };
}

export function isAppError(value: unknown): value is AppError {
  return (
    typeof value === "object" &&
    value !== null &&
    "status" in value &&
    "message" in value &&
    typeof (value as AppError).status === "number" &&
    typeof (value as AppError).message === "string"
  );
}

export function isAuthError(error: unknown): boolean {
  const appError = toAppError(error);
  return (
    appError.kind === "auth" ||
    appError.status === 401 ||
    appError.status === 403
  );
}

export function isValidationError(error: unknown): boolean {
  const appError = toAppError(error);
  return appError.kind === "validation";
}

export function isNetworkError(error: unknown): boolean {
  const appError = toAppError(error);
  return appError.kind === "network";
}

export function isServerError(error: unknown): boolean {
  const appError = toAppError(error);
  return appError.kind === "server";
}

export function getUserFacingMessage(error: unknown): string {
  return toAppError(error).message;
}
