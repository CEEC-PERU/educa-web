import { useEffect, useState } from 'react';
import { CourseDetail } from '../interfaces/CourseDetail';
import { getCourseDetail } from '../services/courseDetail';
import { useAuth } from '../context/AuthContext';

export const useCourseDetail = (course_id: number) => {
  const [courseDetail, setCourseDetail] = useState<CourseDetail[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth();
  const userInfo = user as { id: number };

  useEffect(() => {
    const fetchCourseDetail = async () => {
      if (!token) {
        return;
      }
      setIsLoading(true);
      try {
        
        const response = await getCourseDetail(token, course_id);
        if (response === null) {
          setCourseDetail([]); 
        } else if (Array.isArray(response)) {
          setCourseDetail(response); 
        } else {
          setCourseDetail([response]); 
        }
      } catch (error) {
        console.error('Error fetching course detail:', error);
        setError('Error fetching course detail. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseDetail();
  }, [token, course_id]);

  return {
    courseDetail,
    error,
    isLoading
  };
};
