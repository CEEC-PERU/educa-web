import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getMyProgramDetails } from '@/services/training/trainingStudentService';
import { MyProgramDetailsResponse } from '@/interfaces/Training/Training';

export const useMyTrainingsDetails = (programId: number) => {
  const [myTrainingDetails, setMyTrainingDetails] =
    useState<MyProgramDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchMyTrainingDetails = async () => {
      if (!token || !programId || isNaN(programId)) {
        setLoading(false);
        if (programId && isNaN(programId)) {
          setError('ID de programa inválido');
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getMyProgramDetails(programId, token);
        setMyTrainingDetails(data);
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          setMyTrainingDetails(null);
          setError('Programa no encontrado');
        } else {
          setError('Error al cargar los detalles de la capacitación');
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyTrainingDetails();
  }, [token, programId]);

  const refetch = async () => {
    if (!token || !programId || isNaN(programId)) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getMyProgramDetails(programId, token);
      setMyTrainingDetails(data);
    } catch (err) {
      setError('Error al cargar los detalles de la capacitación');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    myTrainingDetails,
    loading,
    error,
    refetch,
  };
};
