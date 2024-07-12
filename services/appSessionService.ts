import axios from 'axios';
import { API_APPSESSION } from '../utils/Endpoints';

export const getUsersActivityCount = async (startDate: string, endDate: string, enterpriseId: number) => {
    const response = await axios.get(`${API_APPSESSION}/activity-count`, {
        params: { startDate, endDate, enterpriseId }
    });
    return response.data;
};
