import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8081/api',
});

// Este interceptor pega el token automáticamente en cada llamada
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem('token');
            window.location.href = '/login'; // Forzar login si el token expiró
        }
        return Promise.reject(error);
    }
);

export default api;