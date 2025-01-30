import axios from 'axios';
import {AnswerTemplate} from '../interfaces/AnswerTemplate';
import { API_ANSWER_TEMPLATE } from '../utils/Endpoints';


// Frontend: Axios call
export const createAnswerTemplate = async (userToken: string, answer_template: AnswerTemplate[]) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };
  
      // POST request to create the answer template
      const response = await axios.post(`${API_ANSWER_TEMPLATE}`, answer_template, config);
      return response.data; // Return the response from the backend
    } catch (error) {
      console.error('Error creating answer template:', error);
      throw new Error('Error creating answer template');
    }
  };
  