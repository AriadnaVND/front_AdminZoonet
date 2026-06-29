import axios from './axios';

export const getAllPosts = () => axios.get('/admin/community/posts');
export const deletePost = (postId) => axios.delete(`/admin/community/posts/${postId}`);
export const analizarPost = (postId) => axios.post(`/admin/community/posts/${postId}/analizar`);
export const getAiMatchHistory = () => axios.get('/admin/community/ai-history');