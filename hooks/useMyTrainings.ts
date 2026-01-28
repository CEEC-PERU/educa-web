import { MyProgram } from '@/interfaces/Training/Training';
import { getMyPrograms } from '@/services/training/trainingStudentService';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const useMyTrainings = () => {
  const [myTrainings, setMyTrainings] = useState<MyProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchMyTrainings = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getMyPrograms(token);
        setMyTrainings(data);
        setError(null);
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          setMyTrainings([]);
          setError(null);
        } else {
          setError('Error al cargar mis programas de formación');
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMyTrainings();
  }, [token]);

  const refetch = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const data = await getMyPrograms(token);
      setMyTrainings(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar mis programas de formación');
    } finally {
      setLoading(false);
    }
  };

  return {
    myTrainings,
    loading,
    error,
    refetch,
  };
};
