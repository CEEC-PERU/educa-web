// useCoursesCount.tsx
import { useEffect, useState } from 'react';
import {CourseMaterial} from '../../interfaces/Courses/courseMaterial';
import { getCourseMaterials } from '../../services/courses/courseMaterial';
import { useAuth } from '../../context/AuthContext';

// Custom Hook to fetch user course data
export const useCoursesMaterials = (course_id : number) => {
  const [coursesMaterials, setCourseMaterial] = useState<CourseMaterial >();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchCourseMaterial = async () => {
      if (!token) return;

      setIsLoading(true);
      try {
        const response = await getCourseMaterials(course_id);
        setCourseMaterial(response);
      } catch (err) {
        console.error('Error fetching course  materials', err);
        setError('Error fetching course amterials . Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseMaterial();
  }, [token]);

  return { error, isLoading , coursesMaterials};
};
