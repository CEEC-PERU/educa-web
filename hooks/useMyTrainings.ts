import { MyProgramsResponse } from '@/interfaces/Training/Training';
import { getMyPrograms } from '@/services/training/trainingStudentService';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const useMyTrainings = (studentId: number | undefined) => {
  const [myTrainings, setMyTrainings] = useState<MyProgramsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchMyTrainings = async () => {
      if (!studentId || !token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getMyPrograms(studentId, token);
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
  }, [studentId, token]);

  const refetch = async () => {
    if (!studentId || !token) return;

    try {
      setLoading(true);
      const data = await getMyPrograms(studentId, token);
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
