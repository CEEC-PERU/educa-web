import axios from 'axios';
import { ProfileRequest , ProfileResponse} from '../interfaces/Profile';
import { API_PROFILE, API_GET_PROFILE_BY_USER } from '../utils/Endpoints';

export const createProfile = async ( userToken : string ,user_id : number , profileData: ProfileRequest) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    // Hacer la solicitud POST a la API del perfil
    const response = await axios.post(`${API_PROFILE}/${user_id}`, profileData, config);
    return response.data;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw new Error('Error creating profile');
  }
};



export const getProfile = async (userToken: string, userId: number): Promise<ProfileResponse> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const response = await axios.get(`${API_GET_PROFILE_BY_USER}/${userId}`, config);
 
    
    return response.data as ProfileResponse;
  } catch (error) {
    console.error('Error getting profile:', error);
    throw new Error('Error getting profile');
  }
};




