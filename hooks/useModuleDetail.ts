import { useEffect, useState } from 'react';
import { Course } from '../interfaces/StudentModule';
import { getModuleDetail } from '../services/courseDetail';
import { useAuth } from '../context/AuthContext';

export const useModuleDetail = (course_id :number) => {
  const [courseData, setCourseData] = useState<Course[]>([]);
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
        const response = await getModuleDetail(token, course_id, userInfo.id);
        console.log(response)
        if (response === null) {
            setCourseData([]); 
            console.log("courseData", courseData)
          } else if (Array.isArray(response)) {
            setCourseData(response); 
            console.log("courseData2", courseData)
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
    fetchCourseStudent();
  }, [token]);

  return {
    courseData,
    error,
    isLoading
  };
};
