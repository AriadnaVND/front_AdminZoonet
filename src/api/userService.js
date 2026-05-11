import axios from './axios';

export const userService = {
    // Obtener todos los usuarios (HU-20)
    getAllUsers: () => axios.get('/admin/users/all'),

    // Crear nuevo usuario (HU-21)
    createUser: (userData) => axios.post('/admin/users/create', userData),

    // Actualizar usuario existente (HU-21)
    updateUser: (id, userData) => axios.put(`/admin/users/update/${id}`, userData),

    // Buscar usuarios por término (HU-23)
    searchUsers: (term) => axios.get(`/admin/users/search?term=${term}`),

    // Actualizar estado (Versión PUT original)
    updateUserStatus: (userId, status) => 
        axios.put(`/admin/users/${userId}/status`, { status }),

    // Bloqueo lógico (Versión PATCH / toggle)
    toggleUserStatus: (id, status) => 
        axios.patch(`/admin/users/toggle-active/${id}?status=${status}`),

    // 🆕 Nuevo método para obtener el perfil del admin logueado (HU-Perfil)
    getAdminProfile: async () => {
        const response = await axios.get('/auth/profile');
        return response.data;
    }
};

// Exportaciones individuales para mantener compatibilidad
export const getUsers = userService.getAllUsers;
export const updateUserStatus = userService.updateUserStatus;
export const getAdminProfile = userService.getAdminProfile; // También lo exportamos individualmente