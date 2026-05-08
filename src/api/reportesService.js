import api from './axios';
export const getLostPets = () => api.get('/api/admin/reports/lost-pets'); // Crea este endpoint en tu back si no existe