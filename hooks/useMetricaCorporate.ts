import { useEffect, useState } from 'react';
import { DonutChartData } from '../interfaces/Metricas';
import { getCountCourseCorporate } from '../services/MetricasCorporateService';
import { useAuth } from '../context/AuthContext';

export const useMetricaCorporate = () => {
  const [donutChartData, setDonutChartData] = useState<DonutChartData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth();
  const userInfo = user as { id: number; enterprise_id: number };

  useEffect(() => {
    const fetchMetricasCorporate = async () => {
      if (!token) {
        return;
      }
      setIsLoading(true);
      try {
        const response = await getCountCourseCorporate(token, userInfo.enterprise_id);
        if (response) {
          setDonutChartData(response); // Assuming response is already a DonutChartData object
        } else {
          setDonutChartData(null);
        }
      } catch (error) {
        console.error('Error fetching course detail:', error);
        setError('Error fetching course detail. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetricasCorporate();
  }, [token, userInfo.enterprise_id]);

  return {
    donutChartData,
    error,
    isLoading,
  };
};
