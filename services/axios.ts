import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:4100/api', // Asegúrate de que esta URL es correcta
  headers: {
    'Content-Type': 'application/json',
    'Authorization': typeof window !== 'undefined' ? `Bearer ${localStorage.getItem('token')}` : ''
  }
});
export default instance;
