import { useEffect, useState , useCallback} from 'react';
import { UserNota } from '../interfaces/Nota';
import { getCourseNota , getCourseNotaSupervisor, getCourseNotaSupervisorClassroom } from '../services/NotasService';
import { useAuth } from '../context/AuthContext';

//useNotas
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
        const response = await getCourseNota(token, userInfo.enterprise_id ,course_id);
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


export const useNotasSupervisor = (course_id: number ) => {
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
        const response = await getCourseNotaSupervisor(token, userInfo.id ,course_id);
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

export const useNotasSupervisorClassroom = (course_id: number, classroom_id: number) => {
  const [courseNotaClassroom, setCourseNotaClassroom] = useState<UserNota[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth();
  const userInfo = user as { id: number; enterprise_id: number };

  // Definir fetchCourseDetail como una función reutilizable
  const fetchCourseDetail = useCallback(
    async (updatedClassroomId?: number) => {
      if (!token) {
        return;
      }
      setIsLoading(true);
      try {
        const response = await getCourseNotaSupervisorClassroom(
          token,
          userInfo.id,
          course_id,
          updatedClassroomId || classroom_id // Usar classroom_id actual si no se pasa un valor
        );
        if (response === null) {
          setCourseNotaClassroom([]);
        } else if (Array.isArray(response)) {
          setCourseNotaClassroom(response);
        } else {
          setCourseNotaClassroom([response]);
        }
      } catch (error) {
        console.error('Error fetching course detail:', error);
        setError('Error fetching course detail. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [token,  course_id, classroom_id]
  );
  

  // useEffect para inicializar la carga
  useEffect(() => {
    fetchCourseDetail();
  }, [fetchCourseDetail]);

  return {
    courseNotaClassroom,
    error,
    isLoading,
    fetchCourseDetail, // Exportar la función para su reutilización
  };
};