import { useState, useEffect } from 'react';
import { fetchTopRankig , fetchAverageTime , fetchUserActive} from '../services/dashboardCorporative';
import { TopRanking , AverageTime , ActiveUser } from '../interfaces/dashboard';
import { useAuth } from '../context/AuthContext';

export const useTop = (selectedCourseId?: number) => {
  const [topRanking, setTopRanking] = useState<TopRanking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
    const { user, token } = useAuth();
    const userInfo = user as { id: number , enterprise_id : number};
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
  
        const data = await fetchTopRankig(selectedCourseId,userInfo.enterprise_id);
        setTopRanking(data);
      } catch (err) {
        setError('Error al obtener los datos del progreso del curso.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCourseId]);

  return {topRanking, loading, error };
};


export const useAverageTime = () => {
    const [averagetime, setAverageTime] = useState<AverageTime[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
          // Obtener datos del localStorage
    const storedUserInfo = localStorage.getItem('userInfo');
    if (!storedUserInfo) {
      throw new Error('No se encontró información del usuario en el localStorage.');
    }

    const { enterprise_id } = JSON.parse(storedUserInfo) as { id: number; enterprise_id: number };

      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await fetchAverageTime(enterprise_id);
          setAverageTime(data);
        } catch (err) {
          setError('Error al obtener los datos del progreso del curso.');
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
    return {averagetime, loading, error };
  };
  

  export const useAUserActive = () => {
    const [activeuser, setActiveUser] = useState<ActiveUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
          // Obtener datos del localStorage
    const storedUserInfo = localStorage.getItem('userInfo');
    if (!storedUserInfo) {
      throw new Error('No se encontró información del usuario en el localStorage.');
    }

    const { enterprise_id } = JSON.parse(storedUserInfo) as { id: number; enterprise_id: number };

      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await fetchUserActive(enterprise_id);
          setActiveUser(data);
        } catch (err) {
          setError('Error al obtener los datos del progreso del curso.');
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
    return {activeuser, loading, error };
  };
  