import type { AppError } from "./error";

export type NotificationKind = "info" | "success" | "warning" | "danger";

export type NotificationPayload = {
  id?: string;
  type: NotificationKind;
  message: string;
};

export type UnauthorizedPayload = {
  error: AppError;
};

type EventMap = {
  notify: NotificationPayload;
  "auth:unauthorized": UnauthorizedPayload;
};

type Listener<K extends keyof EventMap> = (payload: EventMap[K]) => void;

const listeners: { [K in keyof EventMap]: Set<Listener<K>> } = {
  notify: new Set(),
  "auth:unauthorized": new Set(),
};

export function on<K extends keyof EventMap>(
  event: K,
  listener: Listener<K>,
): () => void {
  listeners[event].add(listener);
  return () => {
    listeners[event].delete(listener);
  };
}

export function emit<K extends keyof EventMap>(
  event: K,
  payload: EventMap[K],
): void {
  listeners[event].forEach((listener) => {
    try {
      listener(payload);
    } catch (err) {
      console.error(`[http events] listener for "${event}" failed`, err);
    }
  });
}
