import { useState, useEffect } from 'react';
import { StudentAssignment } from '@/interfaces/Training/Training';
import { useAuth } from '@/context/AuthContext';
import { getStudentAssignments } from '@/services/training/trainingService';

export const useTrainingAssignment = (programId: number | undefined) => {
  const [studentAssignments, setStudentAssignments] = useState<
    StudentAssignment[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchStudentAssignments = async () => {
      if (!programId || !token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getStudentAssignments(programId, token);
        setStudentAssignments(data);
        setError(null);
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          setStudentAssignments([]);
          setError(null);
        } else {
          setError(
            'Error al cargar los estudiantes asignados al programa de formación',
          );
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudentAssignments();
  }, [programId, token]);

  const refetch = async () => {
    if (!programId || !token) return;

    try {
      setLoading(true);
      const data = await getStudentAssignments(programId, token);
      setStudentAssignments(data);
      setError(null);
    } catch (err) {
      setError(
        'Error al cargar los estudiantes asignados al programa de formación',
      );
    } finally {
      setLoading(false);
    }
  };

  return { studentAssignments, loading, error, refetch };
};
