import { useEffect, useState } from "react";
import { UserNota } from "../../interfaces/Nota";
import { getCourseNotaUserId } from "../../services/NotasService";
import { useAuth } from "../../context/AuthContext";

export const useAllNotas = (courseIds: number[]) => {
  const [notasByCourse, setNotasByCourse] = useState<Record<number, UserNota | null>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth();
  const userInfo = user as { id: number; enterprise_id: number };

  const courseIdsKey = courseIds.join(",");

  useEffect(() => {
    if (!token || !courseIdsKey) {
      setNotasByCourse({});
      return;
    }

    let isCancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const entries = await Promise.all(
          courseIdsKey.split(",").map(async (idStr) => {
            const courseId = Number(idStr);
            try {
              const response = await getCourseNotaUserId(
                token,
                userInfo.enterprise_id,
                courseId,
                userInfo.id,
              );
              const nota = Array.isArray(response) ? response[0] : response;
              return [courseId, nota ?? null] as const;
            } catch (error) {
              console.error(`Error fetching nota for course ${courseId}:`, error);
              return [courseId, null] as const;
            }
          }),
        );

        if (isCancelled) return;
        setNotasByCourse(Object.fromEntries(entries));
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    load();

    return () => {
      isCancelled = true;
    };
  }, [token, courseIdsKey]);

  return { notasByCourse, isLoading };
};
