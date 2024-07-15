import { useEffect, useState } from 'react';
import { CourseStudent } from '../interfaces/CourseStudent';
import { getCourseStudent } from '../services/courseStudent';
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
    isLoading
  };
};
