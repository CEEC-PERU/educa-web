import { useState } from 'react';
import {ResultModule} from '../interfaces/ResultModule';
import { createModuleResult} from '../services/moduleResult';
import { useAuth } from '../context/AuthContext';

export const useResultModule = () => {
  const [resultmodules, setResultModule] = useState<ResultModule | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth();
 // const userInfo = user as { id: number };
  const createResultModule = async (ResultModuleData: ResultModule) => {
    setIsLoading(true);
    try {
      if (!token) {
        throw new Error('Token is null or undefined');
      }
      //resolver errores de envio de datos al Api , parametros en la lista
     const response = await createModuleResult(token,  ResultModuleData);
     console.log(response)
     //setResultModule(response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error updating profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return {
    error,
    isLoading,
    createResultModule,
  };
};
