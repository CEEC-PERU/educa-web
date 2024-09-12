import { useEffect, useState } from 'react';
import { UserNota } from '../interfaces/Nota';
import { getCourseNotaUserId } from '../services/NotasService';
import { useAuth } from '../context/AuthContext';

export const useNotas = (course_id: number ) => {
  const [courseNota, setCourseNota] = useState<UserNota[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth();
  const userInfo = user as { id: number , enterprise_id : number};
//useEffect
  useEffect(() => {
    const fetchCourseDetail = async () => {
      if (!token) {
        return;
      }
      setIsLoading(true);
      try {
        const response = await getCourseNotaUserId(token, userInfo.enterprise_id ,course_id , userInfo.id);
        if (response === null) {
          setCourseNota([]); 
        } else if (Array.isArray(response)) {
          setCourseNota(response); 
        } else {
          setCourseNota([response]); 
        }
      } catch (error) {
        console.error('Error fetching course detail:', error);
        setError('Error fetching course detail. Please try again.');
      } finally {
        setIsLoading(false);
        //carga 
      }
    };

    fetchCourseDetail();
  }, [token, course_id]);

  return {
    courseNota,
    error,
    isLoading
  };
};
