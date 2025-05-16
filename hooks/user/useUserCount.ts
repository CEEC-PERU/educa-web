import { useEffect, useState } from 'react';
import { UserCount } from '../../interfaces/User/UserCount';
import { getUserCount } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

//useNotas
export const useUserCount = () => {
  const [usercount, setUserCount] = useState<UserCount[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth();
  const userInfo = user as { id: number; enterprise_id: number };
  //useEffect
  useEffect(() => {
    const fetchCourseDetail = async () => {
      if (!token) {
        return;
      }
      setIsLoading(true);
      try {
        const response = await getUserCount(token, userInfo.enterprise_id);
        if (response === null) {
          setUserCount([]);
        } else if (Array.isArray(response)) {
          setUserCount(response);
        } else {
          setUserCount([response]);
        }
      } catch (error) {
        console.error('Error fetching course detail:', error);
        setError('Error fetching course detail. Please try again.');
      } finally {
        setIsLoading(false);
        //carga
      }
    };

    fetchCourseDetail();
  }, [token]);
  return {
    usercount,

    error,
    isLoading,
  };
};
