import { useState, useEffect } from 'react';
import { getAllProgramsBySupervisor } from '@/services/training/trainingService';
import { TrainingProgram } from '@/interfaces/Training/Training';
import { useAuth } from '../context/AuthContext';

export const useTrainings = (supervisorId: number | undefined) => {
  const [trainings, setTrainings] = useState<TrainingProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchTrainings = async () => {
      if (!supervisorId || !token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getAllProgramsBySupervisor(supervisorId, token);
        setTrainings(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los programas de formación');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
  }, [supervisorId, token]);

  const refetch = async () => {
    if (!supervisorId || !token) return;

    try {
      setLoading(true);
      const data = await getAllProgramsBySupervisor(supervisorId, token);
      setTrainings(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los programas de formación');
    } finally {
      setLoading(false);
    }
  };

  return { trainings, loading, error, refetch };
};
