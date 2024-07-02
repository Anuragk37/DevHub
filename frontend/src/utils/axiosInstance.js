import axios from 'axios';
import {store} from '../app/store';


const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.userAccessToken; 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
