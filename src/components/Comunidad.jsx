import React, { useEffect, useState } from 'react';
import { getAllPosts, deletePost } from '../api/communityService';
import {
    Heart,
    MessageCircle,
    Share2,
    Trash2,
    BrainCircuit,
    MessageSquare,
    Clock,
    Shield,
    X,
    AlertCircle
} from 'lucide-react';

const Comunidad = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estados para el Modal de Confirmación
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            const response = await getAllPosts();
            const dataWithImages = response.data
                .slice(0, 3) 
                .map((p, index) => ({
                    ...p,
                    imageUrl: `https://placedog.net/1000/600?id=${index + 10}`,
                    likes: Math.floor(Math.random() * 50) + 10,
                    comments: Math.floor(Math.random() * 20) + 5,
                    shares: Math.floor(Math.random() * 10) + 2,
                    iaScore: Math.floor(Math.random() * 5) + 2
                }));
            setPosts(dataWithImages);
        } catch (error) {
            console.error("Error cargando posts", error);
        } finally {
            setLoading(false);
        }
    };

    // Abre el modal en lugar de usar window.confirm
    const openDeleteModal = (postId) => {
        setPostToDelete(postId);
        setIsConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!postToDelete) return;
        try {
            await deletePost(postToDelete);
            setPosts(posts.filter(p => p.id !== postToDelete));
            setIsConfirmOpen(false);
            setPostToDelete(null);
        } catch {
            alert("Error al eliminar");
        }
    };

    const totalPosts = posts.length;
    const engagement = posts.reduce((sum, p) => sum + p.likes + p.comments, 0);

    if (loading) return <div className="p-10 text-teal-400 font-bold animate-pulse text-center">Cargando Comunidad...</div>;

    return (
        <div className="relative space-y-10 animate-in fade-in duration-500 bg-[#0f172a] p-6 md:p-10 min-h-screen text-left">
            
            {/* MODAL DE CONFIRMACIÓN PERSONALIZADO */}
            {isConfirmOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#1e293b] border border-slate-700 w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden p-8 text-center space-y-6">
                        <div className="bg-rose-500/10 text-rose-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                            <AlertCircle size={32} />
                        </div>
                        
                        <div>
                            <h3 className="text-white text-xl font-black">¿Eliminar publicación?</h3>
                            <p className="text-slate-400 mt-2 text-sm">Esta acción no se puede deshacer y el contenido desaparecerá del feed.</p>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button 
                                onClick={() => setIsConfirmOpen(false)}
                                className="flex-1 px-6 py-3 rounded-2xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-all"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={confirmDelete}
                                className="flex-1 px-6 py-3 rounded-2xl bg-rose-500 text-white font-black shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ENCABEZADO */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Gestión de Comunidad con IA</h1>
                    <p className="text-slate-500 font-medium mt-2">
                        Supervisión en tiempo real de la actividad social y seguridad de contenidos.
                    </p>
                </div>
                
                <div className="bg-[#1e293b] border border-slate-800 px-5 py-2 rounded-full flex items-center gap-3 shadow-lg shadow-black/20">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
                    <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">IA Moderando en vivo</span>
                </div>
            </div>

            {/* GRID MÉTRICAS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard icon={<MessageSquare size={18} />} label="Publicaciones" value={totalPosts} color="teal" />
                <MetricCard icon={<BrainCircuit size={18} />} label="Moderadas x IA" value="98%" color="blue" />
                <MetricCard icon={<Shield size={18} />} label="Estado" value="Seguro" color="green" />
                <MetricCard icon={<Heart size={18} />} label="Interacciones" value={engagement} color="rose" />
            </div>

            {/* FEED */}
            <div className="max-w-5xl mx-auto space-y-10">
                <div className="flex items-center gap-4 px-4">
                    <div className="h-[1px] flex-grow bg-slate-800"></div>
                    <h3 className="text-slate-500 font-black text-xs uppercase tracking-[0.4em]">Feed Reciente</h3>
                    <div className="h-[1px] flex-grow bg-slate-800"></div>
                </div>
                
                {posts.map(post => (
                    <article key={post.id} className="group bg-[#1e293b] rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl transition-all hover:border-teal-500/30">
                        <div className="p-8 flex justify-between items-center">
                            <div className="flex items-center gap-5 text-left">
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center text-white font-black text-2xl">
                                        {post.authorUsername?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 bg-[#2dd4bf] w-5 h-5 rounded-full border-4 border-[#1e293b]"></div>
                                </div>
                                <div>
                                    <h4 className="text-white text-xl font-bold">@{post.authorUsername}</h4>
                                    <p className="text-slate-500 text-sm flex items-center gap-2">
                                        <Clock size={14} /> {post.createdAt || 'Justo ahora'}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => openDeleteModal(post.id)} 
                                className="text-slate-600 hover:text-rose-500 p-3 rounded-2xl transition-all hover:bg-rose-500/10"
                            >
                                <Trash2 size={22} />
                            </button>
                        </div>

                        <div className="px-10 pb-6 text-left">
                            <p className="text-slate-200 text-lg leading-relaxed">{post.content}</p>
                        </div>

                        <div className="px-6 pb-6">
                            <div className="relative rounded-[2.5rem] overflow-hidden">
                                <img src={post.imageUrl} alt="post" className="w-full h-[500px] object-cover transition-transform duration-1000 group-hover:scale-105" />
                                <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-2xl flex items-center gap-3">
                                    <BrainCircuit size={18} className="text-teal-400" />
                                    <span className="text-white text-xs font-black uppercase tracking-wider">Seguridad IA: {post.iaScore}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="px-10 py-8 bg-slate-900/50 border-t border-slate-800 flex justify-between items-center">
                            <div className="flex gap-10">
                                <ActionBtn icon={<Heart size={24}/>} count={post.likes} color="rose" />
                                <ActionBtn icon={<MessageCircle size={24}/>} count={post.comments} color="teal" />
                                <ActionBtn icon={<Share2 size={24}/>} count={post.shares} color="blue" />
                            </div>
                            <div className="bg-teal-500/10 text-teal-400 px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border border-teal-500/20">
                                Verificado por Zoonet
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

const MetricCard = ({ icon, label, value, color }) => {
    const theme = {
        teal: "text-teal-400 bg-teal-400/10 border-teal-500/20",
        blue: "text-blue-400 bg-blue-400/10 border-blue-500/20",
        green: "text-green-500 bg-green-500/10 border-green-500/20",
        rose: "text-rose-400 bg-rose-400/10 border-rose-500/20",
    };
    return (
        <div className="bg-[#1e293b] p-8 rounded-[2rem] border border-slate-800 flex flex-col items-center justify-center space-y-4 hover:border-slate-700 transition-colors shadow-lg">
            <div className={`p-3 rounded-2xl ${theme[color]}`}>
                {icon}
            </div>
            <div className="text-center">
                <h2 className="text-3xl font-black text-white">{value}</h2>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">{label}</p>
            </div>
        </div>
    );
};

const ActionBtn = ({ icon, count, color }) => {
    const hoverColors = {
        rose: "hover:text-rose-500 hover:bg-rose-500/10",
        teal: "hover:text-teal-400 hover:bg-teal-400/10",
        blue: "hover:text-blue-500 hover:bg-blue-500/10",
    };
    return (
        <button className={`flex items-center gap-3 text-slate-500 transition-all px-4 py-2 rounded-xl ${hoverColors[color]}`}>
            {icon} <span className="font-bold text-lg">{count}</span>
        </button>
    );
};

export default Comunidad;