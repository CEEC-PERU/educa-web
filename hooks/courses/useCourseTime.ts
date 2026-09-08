import { useState, useEffect } from "react";
import {
  CourseTime,
  CourseTimeEnd,
  CourseTimeAverage,
  CourseTimeSummary,
} from "../../interfaces/Courses/CourseTime";
import {
  createCourseTime,
  createCourseTimeEndTime,
  getCourseTimeAverage,
  getCourseTimeSummary,
} from "../../services/courses/courseTimeService";
import { getLearningTimeSummary } from "../../services/courses/courseStudent";
import { useAuth } from "../../context/AuthContext";

export const useCourseTime = () => {
  const [courseTime, setCourseTime] = useState<CourseTime | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth();
  const userInfo = user as { id: number };

  const createCourseTimeStart = async (coursetime_start: CourseTime) => {
    setIsLoading(true);
    try {
      console.log("Updating profile for user:", userInfo.id);
      if (!token) {
        throw new Error("Token is null or undefined");
      }
      const response = await createCourseTime(token, coursetime_start);
      setCourseTime(response);
    } catch (error) {
      console.error("Error course time:", error);
      setError("Error updating profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    courseTime,
    error,
    isLoading,
    createCourseTimeStart,
  };
};

export const useCourseTimeEnd = () => {
  const [courseTimeEnd, setCourseTimeEnd] = useState<CourseTimeEnd | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth();
  const userInfo = user as { id: number };

  const createCourseTimeEnd = async (coursetime_end: CourseTimeEnd) => {
    setIsLoading(true);
    try {
      console.log("Updating profile for user:", userInfo.id);
      if (!token) {
        throw new Error("Token is null or undefined");
      }
      const response = await createCourseTimeEndTime(token, coursetime_end);
      setCourseTimeEnd(response);
    } catch (error) {
      console.error("Error course time:", error);
      setError("Error updating profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    courseTimeEnd,
    error,
    isLoading,
    createCourseTimeEnd,
  };
};

export const useCourseTimeSummary = (limit?: number) => {
  const [summary, setSummary] = useState<CourseTimeSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    const fetchSummary = async () => {
      try {
        setIsLoading(true);
        const data = await getCourseTimeSummary(token, limit);
        setSummary(data);
      } catch (err) {
        console.error("Error fetching course time summary:", err);
        setError("Error al obtener el resumen de tiempo.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [token, limit]);

  return {
    summary,
    error,
    isLoading,
  };
};

export const useAverageCourse = (course_id?: number) => {
  const [coursetimeaverage, setCourseTimeAverage] = useState<
    CourseTimeAverage[]
  >([]);

  const [error, setError] = useState<string | null>(null);
  const [isLoadingAverage, setIsLoadingAverage] = useState<boolean>(true);
  const { user } = useAuth();
  const userInfo = user as { id: number; enterprise_id: number };

  useEffect(() => {
    const fetchAverageCourse = async () => {
      if (!course_id || !userInfo?.enterprise_id) {
        setIsLoadingAverage(false);
        setError("Faltan datos necesarios para obtener el promedio.");
        return;
      }

      try {
        setIsLoadingAverage(true);
        const fetchedAverageCourse = await getCourseTimeAverage(
          course_id,
          2, // Asumiendo role_id 1 es válido
          userInfo.enterprise_id,
        );
        setCourseTimeAverage(fetchedAverageCourse);
      } catch (error) {
        console.error("Error fetching average course:", error);
        setError("Error al obtener el tiempo promedio del curso.");
      } finally {
        setIsLoadingAverage(false);
      }
    };

    fetchAverageCourse();
  }, [course_id]);

  return {
    coursetimeaverage,
    error,
    isLoadingAverage,
  };
};

export const useLearningTimeSummary = () => {
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user, token } = useAuth();
  const userInfo = user as { id: number } | null;

  useEffect(() => {
    if (!token || !userInfo?.id) {
      setIsLoading(false);
      return;
    }

    const fetchLearningTime = async () => {
      try {
        setIsLoading(true);
        const data = await getLearningTimeSummary(token, userInfo.id);
        setTotalSeconds(data.totalSeconds);
      } catch (err) {
        console.error("Error fetching learning time summary:", err);
        setError("Error al obtener el tiempo de formación.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLearningTime();
  }, [token, userInfo?.id]);

  return {
    totalSeconds,
    error,
    isLoading,
  };
};
