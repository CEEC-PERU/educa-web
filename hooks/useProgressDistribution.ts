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

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProgressDistributionSupervisor(token, selectedCourseId);
        setDistributionData(data);
      } catch (err) {
        setError('Error al obtener la distribución de progreso.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, selectedCourseId]);

  return { distributionData, loading, error };
};
