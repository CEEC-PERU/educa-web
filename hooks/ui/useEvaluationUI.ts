import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Profile } from '../../interfaces/User/UserInterfaces';

interface UseEvaluationUIReturn {
  isDrawerOpen: boolean;
  toggleSidebar: () => void;
  userProfile: {
    name: string;
    uri_picture: string;
  };
}

export const useEvaluationUI = (): UseEvaluationUIReturn => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { profileInfo } = useAuth();

  const toggleSidebar = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Extraer información del perfil del usuario
  const getUserProfile = () => {
    let name = '';
    let uri_picture = '';

    if (profileInfo) {
      const profile = profileInfo as Profile;
      name = profile.first_name;
      uri_picture = profile.profile_picture || '';
    }

    return { name, uri_picture };
  };

  return {
    isDrawerOpen,
    toggleSidebar,
    userProfile: getUserProfile(),
  };
};

