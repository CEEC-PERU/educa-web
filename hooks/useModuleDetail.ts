// En useModuleDetail.ts
import { useEffect, useState } from 'react';
import { Course } from '../interfaces/StudentModule';
import { getModuleDetail } from '../services/courseDetail';
import { useAuth } from '../context/AuthContext';

export const useModuleDetail = (course_id: number) => {
  const [courseData, setCourseData] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth(); // Asegúrate de que useAuth proporcione el token correctamente.
  const userInfo = user as { id: number };

  useEffect(() => {
    const fetchCourseStudent = async () => {
      if (!token) {
        throw new Error('Token is null or undefined'); // Asegúrate de que el token esté definido.
      }
      setIsLoading(true);
      try {
        const response = await getModuleDetail(token, course_id, userInfo.id);
        console.log("RESPONSE",response)
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
    };

    // Solo ejecuta fetchCourseStudent si token está definido.
    if (token) {
      fetchCourseStudent();
    }
  }, [token, course_id]); // Asegúrate de que token y course_id estén en las dependencias para re-ejecutar cuando cambien.

  return {
    courseData,
    error,
    isLoading
  };
};
