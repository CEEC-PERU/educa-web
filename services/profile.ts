import axios from 'axios';
import {
  ProfileRequest,
  ProfileRequestLogin,
  ProfileResponse,
  UpdateProfileRequest,
} from '../interfaces/User/Profile';
import {
  API_PROFILE,
  API_GET_PROFILE_BY_USER,
  API_PUT_PROFILE,
} from '../utils/Endpoints';
import { Profile, UserInfo } from '../interfaces/UserInterfaces';
export const createProfile = async (
  userToken: string,
  user_id: number,
  profileData: ProfileRequest
) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    // Hacer la solicitud POST a la API del perfil
    const response = await axios.post(
      `${API_PROFILE}/${user_id}`,
      profileData,
      config
    );
    return response.data;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw new Error('Error creating profile');
  }
};

export const createProfileLogin = async (
  userToken: string,
  user_id: number,
  profileData: ProfileRequest
) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    // Hacer la solicitud POST a la API del perfil
    const response = await axios.post(
      `${API_PROFILE}/login/${user_id}`,
      profileData,
      config
    );
    return response.data;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw new Error('Error creating profile');
  }
};

export const getProfile = async (
  userToken: string,
  userId: number,
  allData = false
): Promise<Profile | null | UserInfo> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };

    // Realizar la solicitud GET al API para obtener el perfil del usuario
    const response = await axios.get<UserInfo>(
      `${API_GET_PROFILE_BY_USER}/${userId}`,
      config
    );

    // Verificar si la respuesta tiene datos y si existe el campo userProfile
    if (response.data && response.data.userProfile) {
      const profile = allData ? response.data : response.data.userProfile;
      console.log('Profile found:', profile);
      return profile;
    } else {
      console.warn('No profile found for user:', userId);
      return null; // Retornar null si el perfil no existe o no se encuentra
    }
  } catch (error) {
    console.error('Error getting profile:', error);
    throw new Error('Error getting profile');
  }
};

export const updatedProfile = async (
  userToken: string,
  user_id: number,
  profileData: UpdateProfileRequest
) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    // Hacer la solicitud POST a la API del perfil
    const response = await axios.put(
      `${API_PUT_PROFILE}/${user_id}`,
      profileData,
      config
    );
    return response.data;
  } catch (error) {
    console.error('Error updateed profile:', error);
    throw new Error('Error updated profile');
  }
};
