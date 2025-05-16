import { useState } from 'react';
import { RequestCourseResult } from '../interfaces/Courses/CourseResult';
import { createCourseResult } from '../services/courseResultService';
import { useAuth } from '../context/AuthContext';

export const useResultCourse = () => {
  const [resultcourse, setResultCourse] = useState<RequestCourseResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth();
  // const userInfo = user as { id: number };
  const createResultCourse = async (ResultCourseData: RequestCourseResult) => {
    setIsLoading(true);
    try {
      if (!token) {
        throw new Error('Token is null or undefined');
      }
      //resolver errores de envio de datos al Api , parametros en la lista
      const response = await createCourseResult(token, ResultCourseData);
      console.log(response);
      //setResultModule(response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error updating profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return {
    error,
    isLoading,
    createResultCourse,
  };
};
