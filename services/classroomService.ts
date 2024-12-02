import axios from 'axios';
import { API_CLASSROOM , API_CLASSROOM_CREATE} from '../utils/Endpoints';
import { Classroom , ClassroomRequest} from '../interfaces/Classroom';


export const getClassroom = async (userToken: string, enterprise_id: number): Promise<Classroom| null> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const response = await axios.get<Classroom>(`${API_CLASSROOM}/${enterprise_id}`, config);
    if (response.data) {
      return response.data; 
    } else {
      console.warn('No enterprise found for user:', enterprise_id);
      return null; 
    }
  } catch (error) {
    console.error('Error getting enterprise:', error);
    throw new Error('Error getting enterprise');
  }
};


export const getClassroombySupervisor = async (userToken: string, enterprise_id: number, user_id:number): Promise<Classroom| null> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const response = await axios.get<Classroom>(`${API_CLASSROOM}/${enterprise_id}/user/${user_id}`, config);
    if (response.data) {
      return response.data; 
    } else {
      console.warn('No enterprise found for user:', enterprise_id);
      return null; 
    }
  } catch (error) {
    console.error('Error getting enterprise:', error);
    throw new Error('Error getting enterprise');
  }
};

export const getClassroombySupervisorT = async (userToken: string, enterprise_id: number, user_id:number): Promise<Classroom| null> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const response = await axios.get<Classroom>(`${API_CLASSROOM}/${enterprise_id}/supervisor/${user_id}`, config);
    if (response.data) {
      return response.data; 
    } else {
      console.warn('No enterprise found for user:', enterprise_id);
      return null; 
    }
  } catch (error) {
    console.error('Error getting enterprise:', error);
    throw new Error('Error getting enterprise');
  }
};

export const createClassroom = async (classroomData: ClassroomRequest): Promise<void> => {
  await axios.post(`${API_CLASSROOM_CREATE}`, classroomData);
};