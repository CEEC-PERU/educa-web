import { useState, useEffect } from 'react';
import {
  CourseTime,
  CourseTimeEnd,
  CourseTimeAverage,
} from '../../interfaces/Courses/CourseTime';
import {
  createCourseTime,
  createCourseTimeEndTime,
  getCourseTimeAverage,
} from '../../services/courses/courseTimeService';
import { useAuth } from '../../context/AuthContext';

export const useCourseTime = () => {
  const [courseTime, setCourseTime] = useState<CourseTime | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth();
  const userInfo = user as { id: number };

  const createCourseTimeStart = async (coursetime_start: CourseTime) => {
    setIsLoading(true);
    try {
      console.log('Updating profile for user:', userInfo.id);
      if (!token) {
        throw new Error('Token is null or undefined');
      }
      const response = await createCourseTime(token, coursetime_start);
      setCourseTime(response);
    } catch (error) {
      console.error('Error course time:', error);
      setError('Error updating profile. Please try again.');
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
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth();
  const userInfo = user as { id: number };

  const createCourseTimeEnd = async (coursetime_end: CourseTimeEnd) => {
    setIsLoading(true);
    try {
      console.log('Updating profile for user:', userInfo.id);
      if (!token) {
        throw new Error('Token is null or undefined');
      }
      const response = await createCourseTimeEndTime(token, coursetime_end);
      setCourseTimeEnd(response);
    } catch (error) {
      console.error('Error course time:', error);
      setError('Error updating profile. Please try again.');
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
        setError('Faltan datos necesarios para obtener el promedio.');
        return;
      }

      try {
        setIsLoadingAverage(true);
        const fetchedAverageCourse = await getCourseTimeAverage(
          course_id,
          1, // Asumiendo role_id 1 es válido
          userInfo.enterprise_id
        );
        setCourseTimeAverage(fetchedAverageCourse);
      } catch (error) {
        console.error('Error fetching average course:', error);
        setError('Error al obtener el tiempo promedio del curso.');
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
