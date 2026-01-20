import { useState, useEffect } from 'react';
import { TrainingContent } from '@/interfaces/Training/Training';
import { useAuth } from '@/context/AuthContext';
import { getTrainingContentsByDay } from '@/services/training/trainingService';
export const useTrainingContent = (dayId: number | undefined) => {
  const [trainingContents, setTrainingContents] = useState<TrainingContent[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchTrainingDayContents = async () => {
      if (!dayId || !token) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await getTrainingContentsByDay(dayId, token);
        setTrainingContents(data);
        setError(null);
      } catch (err: any) {
        if (err.response?.status === 403) {
          setError('No tienes permisos para ver este contenido');
        } else {
          setError('Error al cargar los contenidos de formación');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingDayContents();
  }, [dayId, token]);

  const refetch = async () => {
    if (!dayId || !token) return;

    try {
      setLoading(true);
      const data = await getTrainingContentsByDay(dayId, token);
      setTrainingContents(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los contenidos de formación');
    } finally {
      setLoading(false);
    }
  };

  return { trainingContents, loading, error, refetch };
};
