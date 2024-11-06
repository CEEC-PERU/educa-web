import { useEffect, useState, useCallback } from 'react';
import { Course } from '../interfaces/StudentModule';
import { getModuleDetail } from '../services/courseDetail';
import { useAuth } from '../context/AuthContext';

export const useModuleDetail = (course_id: number) => {
  const [courseData, setCourseData] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth(); // Ensure that `useAuth` provides a valid `token`.
  const userInfo = user as { id: number };

  // Define `fetchCourseStudent` outside of `useEffect` using `useCallback`
  const fetchCourseStudent = useCallback(async () => {
    if (!token) {
      throw new Error('Token is null or undefined');
    }
    setIsLoading(true);
    try {
      const response = await getModuleDetail(token, course_id, userInfo.id);
      console.log("RESPONSE", response);
      if (response === null) {
        setCourseData([]);
      } else if (Array.isArray(response)) {
        setCourseData(response);
      } else {
        setCourseData([response]);
      }
    } catch (error) {
      console.error('Error fetching course student:', error);
      setError('Error fetching course student. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [token, course_id]);

  // Call `fetchCourseStudent` when the component mounts or `token`/`course_id` changes
  useEffect(() => {
    if (token) {
      fetchCourseStudent();
    }
  }, [fetchCourseStudent, token]);

  return {
    courseData,
    error,
    isLoading,
    refetch: fetchCourseStudent, // Return `fetchCourseStudent` as `refetch`
  };
};
