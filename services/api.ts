import { baseURL } from "../utils/Endpoints";
import axios from 'axios';

const api = axios.create({
  baseURL: baseURL,
});

export default api;
