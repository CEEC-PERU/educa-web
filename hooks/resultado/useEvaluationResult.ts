import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { getEvaluationAttemptsStudent } from '../../services/evaluationmodule/evaluation';
import {
  EvaluationAttempt,
  EvaluationAnswer,
  EvaluationQuestion,
} from '../../interfaces/EvaluationModule/EvaluationStudentAttempt';


interface UseEvaluationResultsReturn {
  attempts: EvaluationAttempt[];
  selectedAttempt: EvaluationAttempt | null;
  loading: boolean;
  error: string | null;
  setSelectedAttempt: (attempt: EvaluationAttempt) => void;
  selectAttemptById: (attemptId: number) => void;
}

export const useEvaluationResults = (): UseEvaluationResultsReturn => {
  const [attempts, setAttempts] = useState<EvaluationAttempt[]>([]);
  const [selectedAttempt, setSelectedAttempt] = useState<EvaluationAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const router = useRouter();
  const { evaluation_id } = router.query;

  const userInfo = user as { id: number; enterprise_id: number };

  const selectLatestAttempt = (attempts: EvaluationAttempt[]) => {
    if (attempts.length > 0) {
      const latestAttempt = attempts.reduce((latest, current) => 
        new Date(current.completed_at) > new Date(latest.completed_at) ? current : latest
      );
      setSelectedAttempt(latestAttempt);
    }
  };

  const selectAttemptById = (attemptId: number) => {
    const attempt = attempts.find(a => a.attempt_id === attemptId);
    if (attempt) setSelectedAttempt(attempt);
  };

  useEffect(() => {
    const fetchEvaluationResults = async () => {
      if (!evaluation_id || !userInfo?.id) return;

      try {
        setLoading(true);
        setError(null);

        const data = await getEvaluationAttemptsStudent(
          userInfo.id, 
          Number(evaluation_id)
        );
        
        if (data.success && data.data) {
          setAttempts(data.data);
          selectLatestAttempt(data.data);
        } else {
          throw new Error('No se encontraron resultados');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error('Error fetching evaluation results:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluationResults();
  }, [evaluation_id, userInfo?.id]);

  return {
    attempts,
    selectedAttempt,
    loading,
    error,
    setSelectedAttempt,
    selectAttemptById,
  };
};