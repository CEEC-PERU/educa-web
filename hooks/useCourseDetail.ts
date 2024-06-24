import { useEffect, useState } from 'react';
import { CourseDetail } from '../interfaces/CourseDetial';
import { getCourseDetail } from '../services/courseDetail';
import { useAuth } from '../context/AuthContext';

export const useCourseDetail = (course_id :number) => {
  const [courseDetail, setCourseDetail] = useState<CourseDetail[]>([]);
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
        const response = await getCourseDetail(token, course_id);
        if (response === null) {
            setCourseDetail([]); 
          } else if (Array.isArray(response)) {
            setCourseDetail(response); 
          } else {
            setCourseDetail([response]); 
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
    courseDetail,
    error,
    isLoading
  };
};
