import { useState, useEffect } from 'react';
import { UserEnterprise } from '../interfaces/User/UserEnterprise';
import { getUserEnterprise } from '../services/enterprise';
import { useAuth } from '../context/AuthContext';

export const useEnterprise = () => {
  const [enterprise, setEnterprise] = useState<UserEnterprise | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth();
  const userInfo = user as { id: number };

  const updateEnterprise = async () => {
    setIsLoading(true);
    try {
      console.log('Updating profile for user:', userInfo.id);
      if (!token) {
        throw new Error('Token is null or undefined');
      }
      const response = await getUserEnterprise(token, userInfo.id);
      setEnterprise(response);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error updating profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    updateEnterprise();
  }, []);

  return {
    enterprise,
    error,
    isLoading,
    updateEnterprise,
  };
};
