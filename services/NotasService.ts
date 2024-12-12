import axios from 'axios';
import { API_GET_NOTAS, API_GET_NOTAS_USER_ID  , API_GET_NOTAS_SUPERVISOR, API_GET_NOTAS_SUPERVISOR_CLASSROOM} from '../utils/Endpoints';
import { UserNota} from '../interfaces/Nota';


export const getCourseNota = async (userToken: string , enterprise_id : number , courseId: number): Promise<UserNota| null> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const response = await axios.get<UserNota>(`${API_GET_NOTAS}/${enterprise_id}/${courseId}`, config);
    if (response.data) {
      return response.data; 
    } else {
      console.warn('No enterprise found for user:', courseId);
      return null; 
    }
  } catch (error) {
    console.error('Error getting enterprise:', error);
    throw new Error('Error getting enterprise');
  }
};

export const getCourseNotabyClassroom = async (userToken: string , enterprise_id : number , courseId: number , classroomId : number ): Promise<UserNota| null> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const response = await axios.get<UserNota>(`${API_GET_NOTAS}/${enterprise_id}/${courseId}/${classroomId}`, config);
    if (response.data) {
      return response.data; 
    } else {
      console.warn('No enterprise found for user:', courseId);
      return null; 
    }
  } catch (error) {
    console.error('Error getting enterprise:', error);
    throw new Error('Error getting enterprise');
  }
};

//Lista de usuarios de todos los salones que pertenece al profesor con sus notas 
export const getCourseNotaSupervisor = async (userToken: string ,  user_id : number ,  course_id : number ): Promise<UserNota| null> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const response = await axios.get<UserNota>(`${API_GET_NOTAS_SUPERVISOR}/${user_id}/${course_id}`, config);
    if (response.data) {
      return response.data; 
    } else {
      console.warn('No enterprise found for user:', course_id);
      return null; 
    }
  } catch (error) {
    console.error('Error getting enterprise:', error);
    throw new Error('Error getting enterprise');
  }
};
//Supervisor lista de classroom que se visualiza
export const getCourseNotaSupervisorClassroom = async (userToken: string ,  user_id : number ,  course_id : number  , classroom_id : number): Promise<UserNota| null> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const response = await axios.get<UserNota>(`${API_GET_NOTAS_SUPERVISOR_CLASSROOM}/${user_id}/${course_id}/${classroom_id}`, config);
    if (response.data) {
      return response.data; 
    } else {
      console.warn('No enterprise found for user:', course_id);
      return null; 
    }
  } catch (error) {
    console.error('Error getting enterprise:', error);
    throw new Error('Error getting enterprise');
  }
};

//lista de curso y notas
export const getCourseNotaUserId = async (userToken: string , enterprise_id : number , courseId: number , userId: number): Promise<UserNota| null> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const response = await axios.get<UserNota>(`${API_GET_NOTAS_USER_ID}/${enterprise_id}/${courseId}/user/${userId}`, config);
    if (response.data) {
      return response.data; 
    } else {
      console.warn('No enterprise found for user:', courseId);
      return null; 
    }
  } catch (error) {
    console.error('Error getting enterprise:', error);
    throw new Error('Error getting enterprise');
  }
};