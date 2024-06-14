import { useState } from 'react';
import { ProfileRequest, ProfileResponse } from '../interfaces/Profile';
import { createProfile } from '../services/profile';
import { useAuth } from '../context/AuthContext';
export const useProfile = () => {
  const [profile, setProfile] = useState<ProfileRequest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user , token} = useAuth();
  const userInfo = user as { id: number };
const updateProfile = async (profileData: ProfileRequest) => {
  setIsLoading(true);
  try {
    console.log('Updating profile for user:', userInfo.id);
    if (token === null) {
      throw new Error('Token is null');
    }
    const response = await createProfile(token, userInfo.id, profileData);
    setProfile(response);
  } catch (error) {
    console.error('Error updating profile:', error);
    setError('Error updating profile. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
  return {
    profile,
    error,
    isLoading,
    updateProfile,
  };
};
