import { useState } from 'react';
import { SessionProgress} from '../interfaces/Progress';
import { createSessionProgress , createSessionProgressUser} from '../services/UserProgress';
import { useAuth } from '../context/AuthContext';

export const useProfile = () => {
  const [session_progress, setSessionProgress] = useState<SessionProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth();
  const userInfo = user as { id: number };

  const createSession_Progress = async (session_progress_data: SessionProgress) => {
    setIsLoading(true);
    try {
      console.log('Updating profile for user:', userInfo.id);
      if (!token) {
        throw new Error('Token is null or undefined');
      }
      const response = await createSessionProgress(token,  session_progress_data);
      setSessionProgress(response);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error updating profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    session_progress,
    error,
    isLoading,
    createSession_Progress,
  };
};


export const useSesionProgress = () => {
  const [session_progress, setSessionProgress] = useState<SessionProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth();
  const userInfo = user as { id: number };

  const createSession_Progress = async (session_progress_data: SessionProgress) => {
    setIsLoading(true);
    try {
      console.log('Updating profile for user:', userInfo.id);
      if (!token) {
        throw new Error('Token is null or undefined');
      }
      const response = await createSessionProgressUser(token,  session_progress_data);
      setSessionProgress(response);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error updating profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    session_progress,
    error,
    isLoading,
    createSession_Progress,
  };
};
