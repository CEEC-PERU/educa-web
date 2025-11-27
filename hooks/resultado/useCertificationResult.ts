import { useState, useEffect } from 'react';
import { CertificationAttempt } from '@/interfaces/Certification/CertificationStudentAttempt';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';

interface UseCertificationResultReturn {
  //cantidad de intentos
  loading: boolean;
  error: string | null;
  attempts: CertificationAttempt[];
}

export const useCertificationResult = (): UseCertificationResultReturn => {
  const [attempts, setAttempts] = useState<CertificationAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const { assignment_id } = router.query;
  const userInfo = user as { id: number; enterprise_id: number };

  useEffect(() => {
    const fetchCertificationResults = async () => {
      if (!assignment_id || !userInfo?.id) return;
      try {
        setLoading(true);
        setError(null);

        /*

            //obtener la data de un servicio
            const data = await getCertificationAttemptsStudent(

            )

            */
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error(
          'Error al obtener los resultados de la certificación:',
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
    loading,
    error,
  };
};
