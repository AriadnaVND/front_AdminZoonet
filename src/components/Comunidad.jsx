import React, { useEffect, useState } from 'react';
import { getAllPosts } from '../api/communityService';
import adminApi from '../api/adminApi'; 
import { Clock, ShieldCheck, Heart, MessageCircle, Share2, ClipboardList, AlertCircle, CheckCircle2, CheckSquare } from 'lucide-react';

// --- COMPONENTE AUXILIAR ---
const StatsCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700/50 flex justify-between items-center shadow-lg hover:border-slate-600 transition-all">
        <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{title}</p>
            <h3 className="text-3xl font-black text-white mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl bg-opacity-10 ${colorClass.bg} ${colorClass.text}`}>
            <Icon size={24} />
        </div>
    </div>
);

const Comunidad = () => {
    const [posts, setPosts] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [postsRes, logsRes] = await Promise.all([
                getAllPosts(), 
                adminApi.get('/admin/moderacion/pendientes').catch(() => ({ data: [] }))
            ]);

            const rawData = Array.isArray(postsRes.data) ? postsRes.data : [];
            const logsData = Array.isArray(logsRes.data) ? logsRes.data : [];
            setLogs(logsData);

            const baseUrl = "http://localhost:8081";
            const data = rawData.map(p => ({
                id: p.id,
                authorUsername: p.user?.name || 'Anónimo', 
                content: p.description || 'Sin descripción',
                imageUrl: p.imageUrl ? `${baseUrl}${p.imageUrl}` : 'https://via.placeholder.com/1000x600',
                createdAt: p.createdAt || 'Fecha no disponible',
                // IMPORTANTE: Asegúrate de mapear el tipo de post si tu backend lo envía
                postType: p.postType || 'UNKNOWN' 
            }));
            setPosts(data);
        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-teal-400 text-center font-bold">Sincronizando con el sistema de IA...</div>;

    return (
        <div className="bg-[#0f172a] p-10 min-h-screen text-left">
            <h1 className="text-3xl font-black text-white mb-2">Gestión de Comunidad con IA</h1>
            <p className="text-slate-500 mb-10">Monitoreo en tiempo real de publicaciones y validación automática.</p>
            
            {/* CUADRITOS DE ESTADÍSTICAS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <StatsCard title="Total Publicaciones" value={posts.length} icon={ClipboardList} colorClass={{bg:'bg-teal-500/10', text:'text-teal-500'}} />
                <StatsCard title="Perdidas" value={posts.filter(p => p.postType === 'LOST_ALERT').length} icon={AlertCircle} colorClass={{bg:'bg-rose-500/10', text:'text-rose-500'}} />
                <StatsCard title="Encontradas" value={posts.filter(p => p.postType === 'FOUND_ALERT').length} icon={CheckCircle2} colorClass={{bg:'bg-emerald-500/10', text:'text-emerald-500'}} />
                <StatsCard title="Resueltos (30D)" value={logs.filter(l => l.status === 'APPROVED').length} icon={CheckSquare} colorClass={{bg:'bg-blue-500/10', text:'text-blue-500'}} />
            </div>
            
            <div className="max-w-5xl mx-auto space-y-10">
                {posts.map(post => {
                    const moderation = logs.find(log => log.postId === post.id);
                    return (
                        <article key={post.id} className="group bg-[#1e293b] rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden transition-all hover:border-slate-700">
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-teal-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-teal-500/20">
                                            {post.authorUsername.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-lg">@{post.authorUsername}</h4>
                                            <p className="text-slate-500 text-xs flex items-center gap-1"><Clock size={12} /> {post.createdAt}</p>
                                        </div>
                                    </div>

                                    {/* BADGES DINÁMICOS DE IA */}
                                    {moderation ? (
                                        <div className="flex gap-2">
                                            <span className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-500 px-3 py-1.5 rounded-full text-[10px] font-bold border border-emerald-500/20">
                                                <ShieldCheck size={14} />
                                                IA: {(moderation.aiScore * 100).toFixed(0)}%
                                            </span>
                                            <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold border uppercase ${
                                                moderation.status === 'APPROVED' 
                                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                                                : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                            }`}>
                                                {moderation.status}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="flex items-center gap-1.5 bg-slate-800 text-slate-400 px-3 py-1.5 rounded-full text-[10px] font-bold border border-slate-700">
                                            <AlertCircle size={14} /> Procesando IA...
                                        </span>
                                    )}
                                </div>

                                <p className="text-slate-200 text-lg mb-6">{post.content}</p>
                                <img src={post.imageUrl} alt="post" className="w-full h-[400px] object-cover rounded-3xl" />
                            </div>
                            
                            <div className="px-10 py-6 bg-slate-900/50 rounded-b-[2.5rem] flex gap-8">
                                <button className="flex items-center gap-2 text-rose-500 transition-transform hover:scale-105"><Heart size={20} /> 0</button>
                                <button className="flex items-center gap-2 text-teal-400 transition-transform hover:scale-105"><MessageCircle size={20} /> 0</button>
                                <button className="flex items-center gap-2 text-blue-400 transition-transform hover:scale-105"><Share2 size={20} /> 0</button>
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
};

export default Comunidad;