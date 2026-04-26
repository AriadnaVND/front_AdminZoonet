import React, { useEffect, useState } from 'react';
import { getAllPosts, deletePost, getAiMatchHistory } from '../api/communityService';
import { Trash2, MessageSquare, BrainCircuit, Calendar } from 'lucide-react';

const Comunidad = () => {
    const [posts, setPosts] = useState([]);
    const [aiHistory, setAiHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('posts'); // 'posts' o 'ai'

    useEffect(() => {
        if (activeTab === 'posts') loadPosts();
        else loadAiHistory();
    }, [activeTab]);

    const loadPosts = async () => {
        try {
            const response = await getAllPosts();
            setPosts(response.data);
        } catch (error) {
            console.error("Error cargando posts", error);
        }
    };

    const loadAiHistory = async () => {
        try {
            const response = await getAiMatchHistory();
            setAiHistory(response.data);
        } catch (error) {
            console.error("Error cargando historial IA", error);
        }
    };

    const handleDeletePost = async (postId) => {
        if (window.confirm("¿Eliminar esta publicación por contenido inapropiado?")) {
            try {
                await deletePost(postId);
                setPosts(posts.filter(p => p.id !== postId));
            } catch (error) {
                alert("No se pudo eliminar el post");
            }
        }
    };

    return (
        <div className="p-6 text-white bg-slate-900 min-h-full rounded-3xl border border-slate-800">
            {/* Encabezado según Figma */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold">Panel de Comunidad</h2>
                    <p className="text-gray-400">Moderación de contenido y auditoría de IA Gemini</p>
                </div>
                <div className="flex bg-slate-800 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('posts')}
                        className={`px-4 py-2 rounded-lg transition ${activeTab === 'posts' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                    >
                        Publicaciones
                    </button>
                    <button
                        onClick={() => setActiveTab('ai')}
                        className={`px-4 py-2 rounded-lg transition ${activeTab === 'ai' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                    >
                        Historial IA
                    </button>
                </div>
            </div>

            {activeTab === 'posts' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {posts.map(post => (
                        <div key={post.id} className="bg-slate-800 p-4 rounded-2xl border border-slate-700 hover:border-blue-500 transition">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                        {post.authorUsername?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{post.authorUsername}</p>
                                        <p className="text-xs text-gray-500">{post.createdAt}</p>
                                    </div>
                                </div>
                                <button onClick={() => handleDeletePost(post.id)} className="text-red-400 hover:bg-red-400/10 p-2 rounded-lg">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">{post.content}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-800/50">
                    <table className="w-full text-left">
                        <thead className="bg-slate-800 text-gray-400 text-sm">
                            <tr>
                                <th className="p-4">Usuario</th>
                                <th className="p-4">Mascota Encontrada</th>
                                <th className="p-4">Precisión (IA)</th>
                                <th className="p-4">Fecha</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {aiHistory.map(log => (
                                <tr key={log.id} className="hover:bg-slate-700/30">
                                    <td className="p-4">{log.username}</td>
                                    <td className="p-4 text-blue-400 font-medium">{log.petName}</td>
                                    <td className="p-4">
                                        <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded-md text-xs">
                                            {log.matchPercentage}%
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-400 text-sm">{log.timestamp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Comunidad;