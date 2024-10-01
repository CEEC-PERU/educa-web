import axios from 'axios';
import {ResultModule , RequestResultModule} from '../interfaces/ResultModule';
import { API_POST_MODULE_RESULT} from '../utils/Endpoints';

export const createModuleResult = async ( userToken : string , ModuleResultData: RequestResultModule) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };
      // Hacer la solicitud POST al API de EvaluationModuleResult
      const response = await axios.post(`${API_POST_MODULE_RESULT}`,ModuleResultData, config);
      return response.data;
    } catch (error) {
      console.error('Error al crear createModuleResult', error);
      throw new Error('Error al Crear Resultado de Modulo');
    }
};
