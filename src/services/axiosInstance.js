import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Remplacez par votre URL de base
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    // Si le token est expiré, supprimez-le et redirigez vers la page de connexion
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/login'; // Redirection
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
