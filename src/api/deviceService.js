import api from './axios';

export const getAllDevices = async () => {
    // Llama al AdminPetController de tu back de administrador
    return await api.get('/api/admin/pets/all');
};