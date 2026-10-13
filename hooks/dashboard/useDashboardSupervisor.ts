import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import type { ActiveUser, AverageTime, TopRanking } from "../../interfaces/dashboard";
import {
  fetchSupervisorActiveStudents,
  fetchSupervisorAverageTime,
  fetchSupervisorScores,
  fetchSupervisorTopAdvisors,
} from "../../services/dashboardSupervisor";

function useCourseMetric<T>(
  courseId: number | undefined,
  fetchMetric: (token: string, courseId: number) => Promise<T>,
  errorMessage: string,
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token || courseId === undefined) {
      setData(null);
      setLoading(false);
      return;
    }

    let isCurrent = true;
    setLoading(true);
    setError(null);

    fetchMetric(token, courseId)
      .then((response) => {
        if (isCurrent) setData(response);
      })
      .catch(() => {
        if (isCurrent) setError(errorMessage);
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [courseId, errorMessage, fetchMetric, token]);

  return { data, loading, error };
}

export function useSupervisorTop(courseId?: number) {
  const metric = useCourseMetric<TopRanking[]>(
    courseId,
    fetchSupervisorTopAdvisors,
    "Error al obtener el ranking del curso.",
  );
  return {
    ...metric,
    topRanking: Array.isArray(metric.data) ? metric.data : [],
  };
}

export function useSupervisorNps(courseId?: number) {
  const fetchMetric = useCallback(
    (token: string, selectedCourseId: number) =>
      fetchSupervisorScores(token, selectedCourseId, 1),
    [],
  );
  const metric = useCourseMetric<number[]>(
    courseId,
    fetchMetric,
    "Error al obtener las respuestas de NPS.",
  );
  return {
    ...metric,
    npsData: Array.isArray(metric.data) ? metric.data : [],
  };
}

export function useSupervisorSatisfaction(courseId?: number) {
  const fetchMetric = useCallback(
    (token: string, selectedCourseId: number) =>
      fetchSupervisorScores(token, selectedCourseId, 2),
    [],
  );
  const metric = useCourseMetric<number[]>(
    courseId,
    fetchMetric,
    "Error al obtener las respuestas de satisfacción.",
  );
  return {
    ...metric,
    satisfactionData: Array.isArray(metric.data) ? metric.data : [],
  };
}

function useSupervisorAudienceMetric<T>(
  fetchMetric: (token: string) => Promise<T>,
  errorMessage: string,
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      setData(null);
      setLoading(false);
      return;
    }

    let isCurrent = true;
    setLoading(true);
    setError(null);

    fetchMetric(token)
      .then((response) => {
        if (isCurrent) setData(response);
      })
      .catch(() => {
        if (isCurrent) setError(errorMessage);
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [errorMessage, fetchMetric, token]);

  return { data, loading, error };
}

export function useSupervisorAverageTime() {
  const metric = useSupervisorAudienceMetric<AverageTime[]>(
    fetchSupervisorAverageTime,
    "Error al obtener el tiempo promedio diario.",
  );
  return {
    ...metric,
    averageTime: Array.isArray(metric.data) ? metric.data : [],
  };
}

export function useSupervisorActiveStudents() {
  const metric = useSupervisorAudienceMetric<ActiveUser[]>(
    fetchSupervisorActiveStudents,
    "Error al obtener la participación diaria.",
  );
  return {
    ...metric,
    activeStudents: Array.isArray(metric.data) ? metric.data : [],
  };
}
