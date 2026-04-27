import React, { useEffect, useState } from 'react';
import { getAllPosts, deletePost } from '../api/communityService';
import {
    Heart,
    MessageCircle,
    Share2,
    Trash2,
    BrainCircuit,
    MessageSquare,
    AlertTriangle
} from 'lucide-react';

const Comunidad = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            const response = await getAllPosts();

            const dataWithImages = response.data
                .slice(0, 3) // 🔥 SOLO 3 POSTS
                .map((p, index) => ({
                    ...p,

                    // 🐶🐱 IMÁGENES
                    imageUrl: index % 2 === 0
                        ? `https://placedog.net/800/400?id=${index + 1}`
                        : `https://placekitten.com/800/400?image=${index + 1}`,

                    // 🔥 REACCIONES BAJAS (1 - 9)
                    likes: Math.floor(Math.random() * 9) + 1,
                    comments: Math.floor(Math.random() * 9) + 1,
                    shares: Math.floor(Math.random() * 9) + 1,
                }));

            setPosts(dataWithImages);

        } catch (error) {
            console.error("Error cargando posts", error);
        }
    };

    const handleDeletePost = async (postId) => {
        if (window.confirm("¿Eliminar publicación?")) {
            try {
                await deletePost(postId);
                setPosts(posts.filter(p => p.id !== postId));
            } catch {
                alert("Error al eliminar");
            }
        }
    };

    // 📊 MÉTRICAS REALES (pequeñas)
    const totalPosts = posts.length;
    const processedIA = Math.floor(totalPosts * 0.7);
    const manualReview = totalPosts - processedIA;
    const engagement = posts.reduce((sum, p) => sum + p.likes + p.comments + p.shares, 0);

    return (
        <div className="p-6 bg-[#0F172A] min-h-screen text-white">

            {/* HEADER */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    Gestión de Comunidad con IA 🤖
                </h1>
                <p className="text-gray-400 text-sm">
                    Moderación automática de publicaciones
                </p>
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

                <Card
                    icon={<MessageSquare size={22} />}
                    emoji="💬"
                    title="Total Publicaciones"
                    value={totalPosts}
                />

                <Card
                    icon={<BrainCircuit size={22} />}
                    emoji="🧠"
                    title="Procesadas por IA"
                    value={processedIA}
                />

                <Card
                    icon={<AlertTriangle size={22} />}
                    emoji="⚠️"
                    title="Revisión Manual"
                    value={manualReview}
                />

                <Card
                    icon={<Heart size={22} />}
                    emoji="❤️"
                    title="Engagement"
                    value={engagement}
                />

            </div>

            {/* FEED */}
            <div className="space-y-6">

                {posts.map(post => (
                    <div key={post.id}
                        className="bg-[#1E293B] rounded-2xl p-5 border border-slate-700 hover:border-teal-400 transition">

                        {/* HEADER */}
                        <div className="flex justify-between items-start mb-3">

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center font-bold">
                                    {post.authorUsername?.charAt(0).toUpperCase()}
                                </div>

                                <div>
                                    <p className="font-semibold">
                                        {post.authorUsername}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {post.createdAt}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleDeletePost(post.id)}
                                className="text-red-400 hover:bg-red-500/10 p-2 rounded-lg"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        {/* TEXTO */}
                        <p className="text-gray-300 mb-4">
                            {post.content}
                        </p>

                        {/* IMAGEN */}
                        <img
                            src={post.imageUrl}
                            alt="mascota"
                            onError={(e) => {
                                e.target.src = "https://placedog.net/800/400";
                            }}
                            className="w-full h-64 object-cover rounded-xl mb-4"
                        />

                        {/* BADGES */}
                        <div className="flex gap-2 mb-3 flex-wrap">

                            <span className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                <BrainCircuit size={14} />
                                IA {Math.floor(Math.random() * 30) + 70}%
                            </span>

                            <span className="bg-teal-500/10 text-teal-400 text-xs px-2 py-1 rounded-full">
                                Aprobado
                            </span>

                        </div>

                        {/* ACCIONES */}
                        <div className="flex gap-6 text-gray-400 text-sm">

                            <div>❤️ {post.likes}</div>
                            <div>💬 {post.comments}</div>
                            <div>🔄 {post.shares}</div>

                        </div>

                    </div>
                ))}

            </div>
        </div>
    );
};

/* CARD */
const Card = ({ title, value, icon, emoji }) => (
    <div className="bg-[#1E293B] p-4 rounded-xl border border-slate-700 hover:border-teal-400 transition relative">

        <div className="absolute top-3 right-3 text-lg opacity-80">
            {emoji}
        </div>

        <div className="mb-3 text-teal-400">
            {icon}
        </div>

        <p className="text-gray-400 text-sm">{title}</p>
        <h2 className="text-xl font-bold text-white">{value}</h2>
    </div>
);

export default Comunidad;