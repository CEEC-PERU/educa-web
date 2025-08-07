import { useState, useEffect } from 'react';
import { fetchCourseProgress } from '../services/dashboardCorporative';
import { CourseProgress } from '../interfaces/dashboard';
import { useAuth } from '../context/AuthContext';

export const useCourseProgress = (selectedCourseId?: number) => {
  const [courseProgressData, setCourseProgressData] = useState<
    CourseProgress[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuth();
  const userInfo = user as { id: number; enterprise_id: number };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCourseProgress(
          selectedCourseId,
          userInfo.enterprise_id
        );
        setCourseProgressData(data);
      } catch (err) {
        setError('Error al obtener los datos del progreso del curso.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCourseId]);

  return { courseProgressData, loading, error };
};
