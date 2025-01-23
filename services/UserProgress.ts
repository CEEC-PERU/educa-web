import axios from 'axios';
import {SessionProgress} from '../interfaces/Progress';
import { API_POST_SESSION_PROGRESS , API_GET_PROGRESS_SESSION_BYUSER , API_PUT_PROGRESS_SESSION_BYUSER} from '../utils/Endpoints';
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

export const createSessionProgressUser = async ( userToken : string , progressSessionData: SessionProgress) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    // Hacer la solicitud POST al API de UserProgress
    const response = await axios.post(`${API_POST_SESSION_PROGRESS}/progresstudent`, progressSessionData, config);
    return response.data;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw new Error('Error creating profile');
  }
};


export const getProgressSession = async (userToken: string, userId: number, session_id: number): Promise<SessionProgress> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };

    // Realizar la solicitud GET al API para obtener el perfil del usuario
    const response = await axios.get<SessionProgress>(`${API_GET_PROGRESS_SESSION_BYUSER}/${userId}/session/${session_id}`, config);
    
    // Return the data part of the response
    return response.data;
  } catch (error) {
    console.error('Error getting profile:', error);
    throw new Error('Error getting profile');
  }
};


export const updatedProgressSession = async ( userToken : string ,user_id : number , session_id : number , sessionProgressData: SessionProgress) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const response = await axios.put(`${API_PUT_PROGRESS_SESSION_BYUSER}/${user_id}/session/${session_id}`, sessionProgressData, config);
    return response.data;
  } catch (error) {
    console.error('Error updateed profile:', error);
    throw new Error('Error updated profile');
  }
};


