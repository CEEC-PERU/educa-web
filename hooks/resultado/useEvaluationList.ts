import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStudentEvaluations } from '../../services/evaluationmodule/evaluation';
import { 
  ApiAssignment,
  Evaluation 
} from '../../interfaces/EvaluationModule/Evaluation';

interface UseEvaluationsListReturn {
  evaluations: Evaluation[];
  loading: boolean;
  error: string | null;
  stats: {
    pending: number;
    completed: number;
    overdue: number;
    total: number;
  };
}

export const useEvaluationsList = (): UseEvaluationsListReturn => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const userInfo = user as { id: number; enterprise_id: number };

  // Transformar datos de la API al formato del componente
  const transformApiDataToEvaluations = (apiData: ApiAssignment[]): Evaluation[] => {
    return apiData.map((assignment) => {
      const { evaluation } = assignment;

      // Determinar estado basado en el estado de la asignación y fechas
      let status: 'pending' | 'completed' | 'overdue' = 'pending';
      const currentDate = new Date();
      const dueDate = new Date(assignment.due_date_override || evaluation.due_date);

      if (assignment.status === 'completed') {
        status = 'completed';
      } else if (currentDate > dueDate) {
        status = 'overdue';
      } else {
        status = 'pending';
      }

      return {
        id: assignment.evaluation_sche_id.toString(),
        title: evaluation.title,
        description: evaluation.description,
        duration_minutes: evaluation.duration_minutes,
        total_points: evaluation.total_points,
        due_date: assignment.due_date_override || evaluation.due_date,
        course_name: evaluation.title, // Usando título como nombre del curso
        status,
        max_attempts: evaluation.max_attempts,
        passing_score: evaluation.passing_score,
        instructions: evaluation.instructions,
        total_attempts: evaluation.total_attempts,
        can_attempt: evaluation.can_attempt,
        attempts_remaining: evaluation.attempts_remaining,
      };
    });
  };

  // Calcular estadísticas
  const calculateStats = (evaluations: Evaluation[]) => {
    return {
      pending: evaluations.filter(e => e.status === 'pending').length,
      completed: evaluations.filter(e => e.status === 'completed').length,
      overdue: evaluations.filter(e => e.status === 'overdue').length,
      total: evaluations.length,
    };
  };

  useEffect(() => {
    const fetchEvaluations = async () => {
      if (!userInfo?.id) return;

      try {
        setLoading(true);
        setError(null);

        const apiData = await getStudentEvaluations(userInfo.id);
        const transformedEvaluations = transformApiDataToEvaluations(apiData);
        setEvaluations(transformedEvaluations);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error('Error fetching evaluations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, [userInfo?.id]);

  return {
    evaluations,
    loading,
    error,
    stats: calculateStats(evaluations),
  };
};