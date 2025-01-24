import { useState } from 'react';
import { CourseTime , CourseTimeEnd} from '../interfaces/CourseTime';
import { createCourseTime, createCourseTimeEndTime} from '../services/courseTimeService';
import { useAuth } from '../context/AuthContext';


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
      const response = await createCourseTime(token,  coursetime_start);
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
    const [courseTimeEnd, setCourseTimeEnd] = useState<CourseTimeEnd | null>(null);
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
        const response = await createCourseTimeEndTime(token,  coursetime_end);
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