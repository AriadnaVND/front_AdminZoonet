import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor de solicitud: adjunta el token JWT si existe en el almacenamiento local
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Interceptor de respuesta: maneja errores de autenticación de forma específica
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // CORRECCIÓN: Se elimina el status 403 para evitar expulsiones por rutas inexistentes.
        // Solo redirigimos al login si el status es 401 (No autorizado / Token expirado).
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('role'); // Limpiamos también el rol por seguridad
            window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default api;