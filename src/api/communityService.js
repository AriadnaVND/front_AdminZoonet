import axios from './axios';

// Gestión de Posts
export const getAllPosts = () => axios.get('/admin/community/posts');
export const deletePost = (postId) => axios.delete(`/admin/community/posts/${postId}`);

// Historial de IA (Auditoría de Gemini)
export const getAiMatchHistory = () => axios.get('/admin/community/ai-history');