import axios from 'axios';

const adminApi = axios.create({
    baseURL: 'http://localhost:8081/api', // Puerto exclusivo de Administración
});

adminApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); 
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
}, (error) => Promise.reject(error));

export default adminApi;