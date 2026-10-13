import { useState, useEffect } from 'react';
import { fetchCourseTimeAverageSupervisor } from '../services/dashboardCorporative';
import { CourseTimeAverage } from '../interfaces/Courses/CourseTime';
import { useAuth } from '../context/AuthContext';

export const useCourseTimeAverage = (selectedCourseId?: number) => {
  const [courseTimeData, setCourseTimeData] = useState<CourseTimeAverage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    if (selectedCourseId === undefined) {
      setCourseTimeData([]);
      return;
    }

    let isCurrent = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCourseTimeAverageSupervisor(token, selectedCourseId);
        if (isCurrent) {
          setCourseTimeData(data);
        }
      } catch (err) {
        if (isCurrent) {
          setError('Error al obtener el tiempo promedio por curso.');
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

  return { courseTimeData, loading, error };
};
