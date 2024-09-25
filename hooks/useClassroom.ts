import { useEffect, useState } from 'react';
import { Classroom } from '../interfaces/Classroom';
import { getClassroom, getClassroombySupervisor } from '../services/classroomService';
import { useAuth } from '../context/AuthContext';

export const useClassroom = () => {
  const [classrooms, setClassroom] = useState<Classroom[]>([]);
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
        const response = await getClassroom(token, userInfo.enterprise_id );
        if (response === null) {
          setClassroom([]); 
        } else if (Array.isArray(response)) {
          setClassroom(response); 
        } else {
          setClassroom([response]); 
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
  }, [token]);

  return {
    classrooms,
    error,
    isLoading
  };
};



export const useClassroomUserSupervisor = () => {
  const [classrooms, setClassroom] = useState<Classroom[]>([]);
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
        const response = await getClassroombySupervisor(token, userInfo.enterprise_id , userInfo.id);
        if (response === null) {
          setClassroom([]); 
        } else if (Array.isArray(response)) {
          setClassroom(response); 
        } else {
          setClassroom([response]); 
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
  }, [token]);

  return {
    classrooms,
    error,
    isLoading
  };
};
