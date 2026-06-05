import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { useAuth } from "@/context/AuthContext";
import { createSessionProgressUser } from "@/services/users/UserProgress";

const STORAGE_KEY = "mmind_progress_queue";

interface QueuedItem {
  user_id: number;
  session_id: number;
  progress: number;
  is_completed: boolean;
  timestamp: number;
}

export interface CascadeResult {
  sessionProgress: number;
  moduleProgress: number;
  courseProgress: number;
}

const readQueue = (): QueuedItem[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
};

const writeQueue = (items: QueuedItem[]) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

export const useSessionProgress = (
  sessionId: number | undefined,
  userId: number,
) => {
  const { token } = useAuth();
  const [cascadeResult, setCascadeResult] = useState<CascadeResult | null>(
    null,
  );
  const hasDrained = useRef(false);

  const sendProgress = useCallback(
    async (progress: number, isCompleted: boolean) => {
      if (!sessionId || !token) return;

      const payload = {
        user_id: userId,
        session_id: sessionId,
        progress: Math.round(progress),
        is_completed: isCompleted,
      };

      try {
        const result: CascadeResult = await createSessionProgressUser(
          token,
          payload,
        );
        setCascadeResult(result);
        writeQueue(
          readQueue().filter(
            (i) => i.session_id !== sessionId || i.user_id !== userId,
          ),
        );
      } catch {
        const queue = readQueue().filter(
          (i) => i.session_id !== sessionId || i.user_id !== userId,
        );
        queue.push({ ...payload, timestamp: Date.now() });
        writeQueue(queue);
      }
    },
    [sessionId, userId, token],
  );

  const sendProgressDebounced = useCallback(
    debounce((progress: number, isCompleted: boolean) => {
      sendProgress(progress, isCompleted);
    }, 10_000),
    [sendProgress],
  );

  useEffect(() => {
    return () => {
      sendProgressDebounced.cancel();
    };
  }, [sendProgressDebounced]);

  useEffect(() => {
    if (hasDrained.current || !token) return;
    hasDrained.current = true;

    const queue = readQueue();
    if (queue.length === 0) return;

    const remaining: QueuedItem[] = [];

    Promise.all(
      queue.map(async (item) => {
        try {
          await createSessionProgressUser(token, item);
        } catch {
          remaining.push(item);
        }
      }),
    ).then(() => writeQueue(remaining));
  }, [token]);

  return { sendProgress, sendProgressDebounced, cascadeResult };
};
