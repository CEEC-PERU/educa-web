// useCoursesCount.tsx
import { useEffect, useState } from 'react';
import { GetCoursesByUserResponse } from '../../interfaces/User/UserCount';
import { getCoursesByUser } from '../../services/users/userService';
import { useAuth } from '../../context/AuthContext';

// Custom Hook to fetch user course data
export const useCoursesCount = () => {
  const [coursescount, setCoursesCount] =
    useState<GetCoursesByUserResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth();
  const userInfo = user as { id: number; enterprise_id: number };

  useEffect(() => {
    const fetchCourseDetail = async () => {
      if (!token) return;

      setIsLoading(true);
      try {
        const response = await getCoursesByUser(userInfo.id);
        setCoursesCount(response);
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError('Error fetching course details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseDetail();
  }, [token]);

  return { coursescount, error, isLoading };
};
