import { useState, useEffect } from 'react';
import { fetchCourseProgressSupervisor } from '../services/dashboardCorporative';
import { CourseProgress } from '../interfaces/dashboard';
import { useAuth } from '../context/AuthContext';

export const useCourseProgress = (selectedCourseId?: number) => {
  const [courseProgressData, setCourseProgressData] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    if (selectedCourseId === undefined) {
      setCourseProgressData([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCourseProgressSupervisor(token, selectedCourseId);
        setCourseProgressData(data);
      } catch (err) {
        setError('Error al obtener los datos del progreso del curso.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, selectedCourseId]);

  return { courseProgressData, loading, error };
};
