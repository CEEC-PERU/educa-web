import axios from 'axios';
import {SessionProgress} from '../interfaces/Progress';
import { API_POST_SESSION_PROGRESS} from '../utils/Endpoints';
export const createSessionProgress = async ( userToken : string , progressSessionData: SessionProgress) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };
      // Hacer la solicitud POST al API de UserProgress
      const response = await axios.post(`${API_POST_SESSION_PROGRESS}`, progressSessionData, config);
      return response.data;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw new Error('Error creating profile');
    }
};
