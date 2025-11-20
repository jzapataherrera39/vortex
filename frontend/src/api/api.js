import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use(
  (config) => {
      const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const token = JSON.parse(authStorage).state.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;   },
  (error) => {
  
    return Promise.reject(error);
  }
);

export default api;
