import React, { useEffect, useState, useCallback } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { on } from "@/lib/http/events";
import type { NotificationPayload, NotificationKind } from "@/lib/http/events";

type ActiveNotification = NotificationPayload & { id: string };

const styleByKind: Record<NotificationKind, string> = {
  info: "border-blue-300 bg-blue-50 text-blue-800",
  success: "border-green-300 bg-green-50 text-green-800",
  warning: "border-yellow-300 bg-yellow-50 text-yellow-800",
  danger: "border-red-300 bg-red-50 text-red-800",
};

const AUTO_DISMISS_MS = 5000;

const NotificationProvider: React.FC = () => {
  const [items, setItems] = useState<ActiveNotification[]>([]);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
  }, []);

  useEffect(() => {
    const unsubscribe = on("notify", (payload) => {
      const id =
        payload.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setItems((prev) => [...prev, { ...payload, id }]);
      window.setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    });
    return unsubscribe;
  }, [dismiss]);

  if (items.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-80">
      {items.map((item) => (
        <div
          key={item.id}
          role="alert"
          className={`flex items-start p-3 border-t-4 shadow-md rounded-md ${
            styleByKind[item.type]
          }`}
        >
          <div className="flex-1 text-sm font-medium">{item.message}</div>
          <button
            type="button"
            onClick={() => dismiss(item.id)}
            aria-label="Cerrar notificación"
            className="ml-2 p-1 rounded hover:bg-black/5"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationProvider;
