import { useState, useEffect } from 'react';
import {
  CertificationAttempt,
  UseCertificationResultReturn,
} from '@/interfaces/Certification/CertificationStudentAttempt';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { toInteger } from 'lodash';
import { getCertificationAttemptsStudent } from '@/services/certification/certification';

export const useCertificationResult = (): UseCertificationResultReturn => {
  const [attempts, setAttempts] = useState<CertificationAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAttempt, setSelectedAttempt] =
    useState<CertificationAttempt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const { assignment_id } = router.query;
  const userInfo = user as { id: number; enterprise_id: number };

  const selectLatestAttempt = (attempts: CertificationAttempt[]) => {
    if (attempts.length > 0) {
      const latestAttempt = attempts.reduce((latest, current) =>
        new Date(current.completed_at) > new Date(latest.completed_at)
          ? current
          : latest
      );
      setSelectedAttempt(latestAttempt);
    }
  };

  const selectAttemptById = (attemptId: number) => {
    const attempt = attempts.find((a) => a.attempt_id === attemptId);
    if (attempt) {
      setSelectedAttempt(attempt);
    }
  };

  useEffect(() => {
    const fetchCertificationResults = async () => {
      if (!assignment_id || !userInfo?.id) return;
      try {
        setLoading(true);
        setError(null);

        //obtener la data de un servicio
        const data = await getCertificationAttemptsStudent(
          userInfo.id,
          toInteger(assignment_id)
        );

        console.log('Data de intentos de certificación:', data);

        if (data.success && data.data) {
          setAttempts(data.data);
          selectLatestAttempt(data.data);
        } else {
          setError('No se encontraron intentos de certificación.');
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        console.error(
          'Error al obtener los resultados de la certificacion:',
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCertificationResults();
  }, [assignment_id, userInfo?.id]);

  return {
    attempts,
    selectedAttempt,
    loading,
    error,
    selectAttemptById,
    setSelectedAttempt,
  };
};
