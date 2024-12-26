import { useEffect, useState } from 'react';
import { Classroom } from '../interfaces/Classroom';
import { getClassroom, getClassroombySupervisor , getClassroombySupervisorT} from '../services/classroomService';
import { useAuth } from '../context/AuthContext';

export const useClassroom = () => {
  const [classrooms, setClassroom] = useState<Classroom[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth();

  const fetchClassrooms = async () => {
    setIsLoading(true);
    try {
      // Obtener datos del localStorage
      const storedUserInfo = localStorage.getItem('userInfo');
      if (!storedUserInfo) {
        throw new Error('No se encontró información del usuario en el localStorage.');
      }

      const { enterprise_id } = JSON.parse(storedUserInfo) as { id: number; enterprise_id: number };
      const token = localStorage.getItem('userToken');

      if (!token) {
        throw new Error('No se encontró el token del usuario en el localStorage.');
      }

      // Llamada al servicio para obtener los classrooms
      const response = await getClassroom(token, enterprise_id);

      if (response === null) {
        setClassroom([]);
      } else if (Array.isArray(response)) {
        setClassroom(response);
      } else {
        setClassroom([response]);
      }
    } catch (error) {
      console.error('Error fetching classrooms:', error);
      setError('Error al obtener los classrooms.');
    } finally {
      setIsLoading(false);
    }
  };

  // Ejecuta fetchClassrooms cuando se monta el componente
  useEffect(() => {
    fetchClassrooms();
  }, []);

  return {
    classrooms,
    error,
    isLoading,
    fetchClassrooms, 
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

        const storedUserInfo = localStorage.getItem('userInfo');
        if (!storedUserInfo) {
          throw new Error('No se encontró información del usuario en el localStorage.');
        }
  
       const { id , enterprise_id} = JSON.parse(storedUserInfo) as { id: number; enterprise_id: number };
        const response = await getClassroombySupervisor(token,enterprise_id , userInfo.id);
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


//obtiene para los supervisores especifico de una empresa
export const useClassroomBySupervisor = () => {
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
        const storedUserInfo = localStorage.getItem('userInfo');
        if (!storedUserInfo) {
          throw new Error('No se encontró información del usuario en el localStorage.');
        }
  
       const { id , enterprise_id} = JSON.parse(storedUserInfo) as { id: number; enterprise_id: number };
        const response = await getClassroombySupervisorT(token, enterprise_id , userInfo.id);
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
