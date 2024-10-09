import { useState , useEffect} from 'react';
import {RequestCuestionario , ResponseCuestionario} from '../interfaces/Cuestionario';
import { createCuestionario , getCuestionarioByUser } from '../services/cuestionarioService';
import { useAuth } from '../context/AuthContext';

export const useCreateCuestionario = () => {
  const [resultcuestionario, setResultCuestionario] = useState<RequestCuestionario | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth();
 // const userInfo = user as { id: number };
  const createCuestionarioResult = async (ResultCuestionario: RequestCuestionario) => {
    setIsLoading(true);
    try {
      if (!token) {
        throw new Error('Token is null or undefined');
      }
      //resolver errores de envio de datos al Api , parametros en la lista
     const response = await createCuestionario( ResultCuestionario);
     console.log(response)
     //setResultModule(response.data);
    } catch (error) {
      console.error('Error actualizar useResultModule:', error);
      setError('Error updating module. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return {
    error,
    isLoading,
    createCuestionarioResult,
  };
};

export const useCuestionarioNPS = (course_id :number ) => {
    const [cuestionariosnps, setCuestionarioNPS] = useState<ResponseCuestionario[]>([]);
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
          const response = await getCuestionarioByUser( course_id , userInfo.id, 1 );
          if (response === null) {
            setCuestionarioNPS([]); 
          } else if (Array.isArray(response)) {
            setCuestionarioNPS(response); 
          } else {
            setCuestionarioNPS([response]); 
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
      cuestionariosnps,
      error,
      isLoading
    };
  };


  
export const useCuestionarioStar = (course_id :number ) => {
    const [cuestionariostar, setCuestionarioStar] = useState<ResponseCuestionario[]>([]);
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
          const response = await getCuestionarioByUser( course_id , userInfo.id, 2);
          if (response === null) {
            setCuestionarioStar([]); 
          } else if (Array.isArray(response)) {
            setCuestionarioStar(response); 
          } else {
            setCuestionarioStar([response]); 
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
      cuestionariostar,
      error,
      isLoading
    };
  };

