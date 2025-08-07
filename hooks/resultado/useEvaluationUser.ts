import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { getCuestionarioByUser } from '../../services/evaluationmodule/evaluation';
import { EvaluationAssignment } from '../../interfaces/EvaluationModule/EvaluationStudent';

export const useEvaluationUsers = () => {
  const router = useRouter();
  const { evaluationId } = router.query;

  const [evaluationData, setEvaluationData] = useState<EvaluationAssignment[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<EvaluationAssignment | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getUserDisplayName = (student: any) => {
    if (student?.userProfile?.first_name || student?.userProfile?.last_name) {
      const firstName = student.userProfile.first_name || '';
      const lastName = student.userProfile.last_name || '';
      return `${firstName} ${lastName}`.trim();
    }
    return student?.dni || `Usuario ${student?.user_id || 'Desconocido'}`;
  };

  const getProgressPercentage = (assignment: EvaluationAssignment) => {
    const attempts = assignment.evaluation?.attempts?.length || 0;
    const maxAttempts = assignment.evaluation?.max_attempts || 1;
    return Math.min((attempts / maxAttempts) * 100, 100);
  };

  const getLatestScore = (assignment: EvaluationAssignment) => {
    const attempts = assignment.evaluation?.attempts || [];
    if (attempts.length === 0) return null;
    const latestAttempt = attempts[attempts.length - 1];
    return latestAttempt.score;
  };

  // Nueva función para navegar al detalle del usuario
  const navigateToUserDetail = (userId: number, evaluationScheId: number) => {
    router.push(
      `/supervisor/evaluations/user-detail?user_id=${userId}&evaluation_sche_id=${evaluationScheId}`
    );
  };

  useEffect(() => {
    const fetchEvaluationData = async () => {
      if (evaluationId && typeof evaluationId === 'string') {
        try {
          setLoading(true);
          const data = await getCuestionarioByUser(parseInt(evaluationId));
          setEvaluationData(data);
          setError(null);
        } catch (err) {
          setError('Error al cargar los datos de la evaluación');
          console.error('Error fetching evaluation data:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEvaluationData();
  }, [evaluationId]);

  const filteredData = useMemo(() => {
    return evaluationData.filter((assignment) => {
      const matchesSearch =
        !searchTerm ||
        assignment.student?.dni
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        getUserDisplayName(assignment.student)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        assignment.student?.userProfile?.email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || assignment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [evaluationData, searchTerm, statusFilter]);

  return {
    evaluationId,
    evaluationData,
    filteredData,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedUser,
    setSelectedUser,
    statusFilter,
    setStatusFilter,
    getUserDisplayName,
    getProgressPercentage,
    getLatestScore,
    navigateToUserDetail,
  };
};
