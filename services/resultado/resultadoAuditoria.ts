import axios from 'axios';
import {RequestAuditoria} from '../../interfaces/Resultado/resultadoAuditoria';
import { API_RESPONSE } from '../../utils/Endpoints';
export const createSessionProgress = async ( userToken : string , requestAuditoria: RequestAuditoria ) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };
      // Hacer la solicitud POST al API de UserProgress
      const response = await axios.post(`${API_RESPONSE}`, requestAuditoria, config);
      return response.data;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw new Error('Error creating profile');
    }
};
