import { useState, useEffect } from 'react';
import { getTrainingDaysByProgram } from '@/services/training/training';
import { useAuth } from '@/context/AuthContext';
import { TrainingDay } from '@/interfaces/Training/Training';

export const useTrainingDay = (programId: number | undefined) => {
  const [trainingDays, setTrainingDays] = useState<TrainingDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchTrainingDays = async () => {
      if (!programId || !token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getTrainingDaysByProgram(programId, token);
        setTrainingDays(data);
        setError(null);
      } catch (err: any) {
        if (err.response?.status === 403) {
          setError('No tienes permisos para ver este programa');
        } else {
          setError('Error al cargar los días de formación');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingDays();
  }, [programId, token]);

  const refetch = async () => {
    if (!programId || !token) return;

    try {
      setLoading(true);
      const data = await getTrainingDaysByProgram(programId, token);
      setTrainingDays(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los días de formación');
    } finally {
      setLoading(false);
    }
  };

  return { trainingDays, loading, error, refetch };
};
