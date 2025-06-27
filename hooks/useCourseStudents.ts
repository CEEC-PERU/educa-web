import { useEffect, useState } from 'react';
import { CourseStudent } from '../interfaces/Courses/CourseStudent';
import {
  getCourseStudent,
  getCourseStudentCategory,
} from '../services/courses/courseStudent';
import { useAuth } from '../context/AuthContext';
//useCourseStudent
export const useCourseStudent = () => {
  const [courseStudent, setCourseStudent] = useState<CourseStudent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth();
  const userInfo = user as { id: number };

  useEffect(() => {
    const fetchCourseStudent = async () => {
      setIsLoading(true);
      try {
        if (!token) {
          throw new Error('Token is null or undefined');
        }
        const response = await getCourseStudent(token, userInfo.id);
        if (response === null) {
          setCourseStudent([]);
        } else if (Array.isArray(response)) {
          setCourseStudent(response);
        } else {
          setCourseStudent([response]);
        }
      } catch (error) {
        console.error('Error fetching course student:', error);
        setError('Error fetching course student. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourseStudent();
  }, [token]);

  return {
    courseStudent,
    error,
    isLoading,
  };
};

// Hook actualizado para obtener los datos del curso según la categoría seleccionada
export const useCourseStudentCategory = (categoryId: number | null) => {
  const [courseStudentCategory, setCourseStudentCategory] = useState<
    CourseStudent[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth();
  const userInfo = user as { id: number };

  useEffect(() => {
    const fetchCourseStudent = async () => {
      if (categoryId === null) return; // No ejecuta la función si no hay categoría seleccionada
      setIsLoading(true);
      try {
        if (!token) {
          throw new Error('Token is null or undefined');
        }
        const response = await getCourseStudentCategory(
          token,
          userInfo.id,
          categoryId
        );
        if (response === null) {
          setCourseStudentCategory([]);
        } else if (Array.isArray(response)) {
          setCourseStudentCategory(response);
        } else {
          setCourseStudentCategory([response]);
        }
      } catch (error) {
        console.error('Error fetching course student:', error);
        setError('Error fetching course student. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourseStudent();
  }, [token, categoryId]); // Añadimos categoryId como dependencia

  return {
    courseStudentCategory,
    error,
    isLoading,
  };
};
