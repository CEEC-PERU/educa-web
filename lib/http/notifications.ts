import { emit } from "./events";
import type { NotificationPayload } from "./events";

export type { NotificationPayload, NotificationKind } from "./events";

export function notify(payload: NotificationPayload): void {
  emit("notify", payload);
}
