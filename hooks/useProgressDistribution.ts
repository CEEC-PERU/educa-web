import { useState, useEffect } from 'react';
import { fetchProgressDistributionSupervisor } from '../services/dashboardCorporative';
import { ProgressDistribution } from '../interfaces/dashboard';
import { useAuth } from '../context/AuthContext';

export const useProgressDistribution = (selectedCourseId?: number) => {
  const [distributionData, setDistributionData] = useState<ProgressDistribution[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    if (selectedCourseId === undefined) {
      setDistributionData([]);
      return;
    }

    let isCurrent = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProgressDistributionSupervisor(token, selectedCourseId);
        if (isCurrent) {
          setDistributionData(data);
        }
      } catch (err) {
        if (isCurrent) {
          setError('Error al obtener la distribución de progreso.');
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isCurrent = false;
    };
  }, [token, selectedCourseId]);

  return { distributionData, loading, error };
};
