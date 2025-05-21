import { useState } from 'react';
import {
  ProfileRequest,
  ProfileRequestLogin,
  UpdateProfileRequest,
} from '../../interfaces/User/Profile';
import {
  createProfile,
  createProfileLogin,
  updatedProfile,
} from '../../services/profile';
import { useAuth } from '../../context/AuthContext';

export const useProfile = () => {
  const [profile, setProfile] = useState<ProfileRequestLogin | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth();
  const userInfo = user as { id: number };

  const updateProfile = async (profileData: ProfileRequestLogin) => {
    setIsLoading(true);
    try {
      console.log('Updating profile for user:', userInfo.id);
      if (!token) {
        throw new Error('Token is null or undefined');
      }
      const response = await createProfileLogin(
        token,
        userInfo.id,
        profileData
      );
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

export const useProfile2 = (user_id: number) => {
  const [profile, setProfile] = useState<ProfileRequest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth();

  const updateProfile2 = async (profileData: ProfileRequest) => {
    setIsLoading(true);
    try {
      console.log('Updating profile for user:', user_id);
      if (!token) {
        throw new Error('Token is null or undefined');
      }
      const response = await createProfile(token, user_id, profileData);
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
    updateProfile2,
  };
};

export const useUpdatedProfile = () => {
  const [profile, setProfile] = useState<UpdateProfileRequest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth();
  const userInfo = user as { id: number };

  const updateProfile = async (profileData: UpdateProfileRequest) => {
    setIsLoading(true);
    try {
      console.log('Updating profile for user:', userInfo.id);
      if (!token) {
        throw new Error('Token is null or undefined');
      }
      const response = await updatedProfile(token, userInfo.id, profileData);
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
