import { useEffect, useState } from 'react';
import { DonutChartData } from '../interfaces/Metricas';
import { getCountCourseCorporate } from '../services/MetricasCorporateService';
import { useAuth } from '../context/AuthContext';

export const useMetricaCorporate = () => {
  const [donutChartData, setDonutChartData] = useState<DonutChartData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchMetricasCorporate = async () => {
      if (!token || !user) {
        setError('User not authenticated');
        return;
      }

      const userInfo = user as { id: number; enterprise_id: number };
      if (!userInfo?.enterprise_id) {
        setError('Enterprise ID not available');
        return;
      }

      setIsLoading(true);
      try {
        const response = await getCountCourseCorporate(token, userInfo.enterprise_id);
        console.log(response)
        if (response) {
          setDonutChartData(response);
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
  }, [token, user]);

  return {
    donutChartData,
    error,
    isLoading,
  };
};
