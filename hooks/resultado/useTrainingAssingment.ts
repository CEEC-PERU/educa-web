import { TrainingAssignment } from '@/interfaces/Training/Training';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAllAssignmentsBySupervisor } from '@/services/training/trainingService';

export const useTrainingAssignment = (supervisorId: number | undefined) => {
  const [assignments, setAssignments] = useState<TrainingAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!supervisorId || !token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getAllAssignmentsBySupervisor(supervisorId, token);
        setAssignments(data);
        setError(null);
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          setAssignments([]);
          setError(null);
        } else {
          setError(
            'Error al cargar las asignaciones de programas de formación',
          );
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [supervisorId, token]);

  const refetch = async () => {
    if (!supervisorId || !token) return;

    try {
      setLoading(true);
      const data = await getAllAssignmentsBySupervisor(supervisorId, token);
      setAssignments(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las asignaciones de programas de formación');
    } finally {
      setLoading(false);
    }
  };

  return { assignments, loading, error, refetch };
};
