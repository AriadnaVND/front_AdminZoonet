import axios from './axios';

export const getDashboardStats = async () => {
    try {
        // CAMBIO AQUÍ: Debe ser /summary para que coincida con el Backend
        const response = await axios.get('/admin/dashboard/summary');
        return response.data;
    } catch (error) {
        console.error("Error en la petición del dashboard:", error);
        throw error;
    }
};