import axios from './axios';

export const getDashboardStats = async () => {
    // Este endpoint ya existe en tu AdminDashboardController.java
    const response = await axios.get('/admin/dashboard/stats');
    return response.data;
};