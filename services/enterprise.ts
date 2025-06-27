import axios from 'axios';
import { API_GET_EMPRESA_BY_USER } from '../utils/Endpoints';
import { UserEnterprise } from '../interfaces/User/UserEnterprise';

export const getUserEnterprise = async (
  userToken: string,
  userId: number
): Promise<UserEnterprise | null> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const response = await axios.get<UserEnterprise>(
      `${API_GET_EMPRESA_BY_USER}/${userId}`,
      config
    );
    if (response.data) {
      return response.data;
    } else {
      console.warn('No enterprise found for user:', userId);
      return null;
    }
  } catch (error) {
    console.error('Error getting enterprise:', error);
    throw new Error('Error getting enterprise');
  }
};
