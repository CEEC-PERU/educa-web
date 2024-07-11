import axios from 'axios';
import {ResultModule} from '../interfaces/ResultModule';
import { API_POST_MODULE_RESULT} from '../utils/Endpoints';
export const createModuleResult = async ( userToken : string , ModuleResultData: ResultModule) => {
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
      console.error('Error creating profile:', error);
      throw new Error('Error creating profile');
    }
};
