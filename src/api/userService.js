import axios from './axios';

export const getUsers = () => axios.get('/admin/users/all');

export const updateUserStatus = (userId, status) =>
    axios.put(`/admin/users/${userId}/status`, { status });