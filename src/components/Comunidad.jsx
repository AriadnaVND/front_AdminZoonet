import React, { useEffect, useState, useCallback } from 'react';
import adminApi from '../api/adminApi';
import {
    MessageCircle, BrainCircuit, Heart, Clock,
    ShieldCheck, Activity
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, badge }) => (
    <div className={`bg-[#1e293b] rounded-2xl p-6 border-l-4 ${color} shadow-sm flex items-center justify-between`}>
        <div>
            <p className="text-sm text-slate-400 font-medium">{title}</p>
            <h3 className="text-3xl font-black text-white mt-1">{Number(value || 0).toLocaleString()}</h3>
        </div>
        <div className="flex flex-col items-end gap-2">
            {badge !== undefined && (
                <span className="bg-teal-100 text-teal-700 text-xs font-bold px-2 py-1 rounded-full">{badge}</span>
            )}
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                <Icon size={22} className="text-slate-400" />
            </div>
        </div>
    </div>
);

const ModerationBadge = ({ moderation, postType }) => {
    if (!moderation) return null;
    const typeLabel = postType === 'LOST_ALERT' ? 'Perdido'
        : postType === 'FOUND_ALERT' ? 'Encontrado'
        : postType === 'REUNION' ? 'Reunion'
        : postType || '';

    return (
        <div className="flex items-center gap-2 flex-wrap justify-end">
            <span className="flex items-center gap-1 bg-teal-50 text-teal-700 border border-teal-200 text-[11px] font-bold px-3 py-1 rounded-full">
                <ShieldCheck size={12} /> IA: {(moderation.aiScore * 100).toFixed(0)}%
            </span>
            <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                moderation.status === 'APPROVED'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-red-50 text-red-600 border-red-200'
            }`}>
                {moderation.status === 'APPROVED' ? '✓ Aprobado' : '✗ Rechazado'}
            </span>
            {typeLabel && (
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                    {typeLabel}
                </span>
            )}
        </div>
    );
};

const Comunidad = () => {
    const [posts, setPosts] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [activeFilter, setActiveFilter] = useState('todas');
    const [analyzingIds, setAnalyzingIds] = useState(new Set());

    const loadData = useCallback(async () => {
        try {
            const [postsRes, logsRes] = await Promise.all([
                adminApi.get('/admin/community/posts'),
                adminApi.get('/admin/moderacion/todos').catch(() => ({ data: [] }))
            ]);

            const rawData = Array.isArray(postsRes.data) ? postsRes.data : [];
            const logsData = Array.isArray(logsRes.data) ? logsRes.data : [];
            setLogs(logsData);

            const API_DOMAIN = 'https://api.vickari.site';

            const data = rawData.map(p => ({
                id: Number(p.id),
                authorUsername: p.user?.name || 'Anónimo',
                content: p.description || 'Sin descripción',
                imageUrl: p.imageUrl
                    ? (p.imageUrl.startsWith('http') ? p.imageUrl : `${API_DOMAIN}${p.imageUrl.startsWith('/') ? '' : '/'}${p.imageUrl}`)
                    : null,
                createdAt: p.createdAt || '',
                postType: p.postType || 'UNKNOWN',
                reactions: Array.isArray(p.reactions) ? p.reactions.length : 0,
                comments: Array.isArray(p.comments) ? p.comments.length : 0,
            }));
            setPosts(data);
            return { data, logsData };
        } catch (err) {
            console.error('Error cargando datos:', err);
            return { data: [], logsData: [] };
        } finally {
            setLoading(false);
        }
    }, []);

    const analizarPost = useCallback(async (postId) => {
        setAnalyzingIds(prev => new Set(prev).add(postId));
        try {
            await adminApi.post(`/admin/community/posts/${postId}/analizar`);
        } catch (err) {
            console.error(`Error analizando post ${postId}:`, err);
        } finally {
            setAnalyzingIds(prev => {
                const next = new Set(prev);
                next.delete(postId);
                return next;
            });
        }
    }, []);

    useEffect(() => {
        const init = async () => {
            setAnalyzing(true);
            const { data, logsData } = await loadData();

            const sinModerar = data.filter(
                post => !logsData.some(log => Number(log.postId) === Number(post.id))
            );

            if (sinModerar.length > 0) {
                for (let i = 0; i < sinModerar.length; i += 3) {
                    const chunk = sinModerar.slice(i, i + 3);
                    await Promise.all(chunk.map(p => analizarPost(p.id)));
                }
                await loadData();
            }
            setAnalyzing(false);
        };
        init();
    }, []);

    const totalReacciones = posts.reduce((acc, p) => acc + (p.reactions || 0), 0);
    const procesadasPorIA = posts.filter(p =>
        logs.some(l => Number(l.postId) === Number(p.id))
    ).length;
    const countIA = procesadasPorIA;

    const filteredPosts = posts.filter(post => {
        if (activeFilter === 'ia') return logs.some(log => Number(log.postId) === Number(post.id));
        return true;
    });

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        try {
            return new Date(dateStr).toLocaleDateString('es-PE', {
                day: '2-digit', month: 'short', year: 'numeric'
            });
        } catch { return dateStr; }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="text-center">
                <BrainCircuit className="mx-auto mb-3 text-teal-500 animate-pulse" size={40} />
                <p className="text-gray-500 font-medium">Cargando comunidad...</p>
            </div>
        </div>
    );

    return (
        <div className="bg-[#0f172a] min-h-screen p-8">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-white">Gestión de Comunidad con IA</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        La IA analiza automáticamente las publicaciones al cargar.
                    </p>
                </div>
                {analyzing && (
                    <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 px-4 py-2 rounded-full text-sm font-medium">
                        <BrainCircuit size={16} className="animate-pulse" />
                        Analizando publicaciones...
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="Total Publicaciones"
                    value={posts.length}
                    icon={MessageCircle}
                    color="border-teal-400"
                    badge={`${countIA} con IA`}
                />
                <StatCard
                    title="Procesadas por IA"
                    value={procesadasPorIA}
                    icon={BrainCircuit}
                    color="border-green-400"
                    badge={posts.length > 0 ? Math.round((procesadasPorIA / posts.length) * 100) + '%' : '0%'}
                />
                <StatCard
                    title="Total Reacciones"
                    value={totalReacciones}
                    icon={Heart}
                    color="border-pink-400"
                />
            </div>

            {/* Filtros */}
            <div className="flex gap-3 mb-6">
                <button
                    onClick={() => setActiveFilter('todas')}
                    className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all ${
                        activeFilter === 'todas'
                            ? 'bg-teal-500 text-white shadow-md'
                            : 'bg-[#1e293b] text-slate-400 border border-slate-700 hover:border-teal-300'
                    }`}
                >
                    Todas
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        activeFilter === 'todas' ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-400'
                    }`}>{posts.length}</span>
                </button>
                <button
                    onClick={() => setActiveFilter('ia')}
                    className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all ${
                        activeFilter === 'ia'
                            ? 'bg-green-500 text-white shadow-md'
                            : 'bg-[#1e293b] text-slate-400 border border-slate-700 hover:border-green-300'
                    }`}
                >
                    <BrainCircuit size={14} />
                    Procesadas por IA
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        activeFilter === 'ia' ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-400'
                    }`}>{countIA}</span>
                </button>
            </div>

            {/* Posts */}
            <div className="space-y-4">
                {filteredPosts.map(post => {
                    const moderation = logs.find(log => Number(log.postId) === Number(post.id));
                    const isAnalyzingThis = analyzingIds.has(post.id);

                    return (
                        <div key={post.id} className="bg-[#1e293b] rounded-2xl border border-slate-800 shadow-sm overflow-hidden">

                            {/* Card Header */}
                            <div className="p-5 border-b border-slate-800">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white font-black text-base shrink-0">
                                            {post.authorUsername.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-sm">{post.authorUsername}</p>
                                            <p className="text-slate-500 text-xs flex items-center gap-1">
                                                <Clock size={10} /> {formatDate(post.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Badge derecho */}
                                    <div className="flex items-center gap-2 flex-wrap justify-end">
                                        {isAnalyzingThis ? (
                                            <span className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 border border-yellow-200 text-[11px] font-bold px-3 py-1 rounded-full animate-pulse">
                                                <BrainCircuit size={12} /> Analizando...
                                            </span>
                                        ) : moderation ? (
                                            <ModerationBadge moderation={moderation} postType={post.postType} />
                                        ) : (
                                            <>
                                                <button
                                                    onClick={async () => {
                                                        await analizarPost(post.id);
                                                        await loadData();
                                                    }}
                                                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full transition-all"
                                                >
                                                    <BrainCircuit size={12} /> Analizar con IA
                                                </button>
                                                {post.postType !== 'UNKNOWN' && (
                                                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                                                        {post.postType === 'LOST_ALERT' ? 'Perdido'
                                                            : post.postType === 'FOUND_ALERT' ? 'Encontrado'
                                                            : post.postType}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Contenido */}
                            <div className="p-5">
                                <p className="text-slate-300 text-sm mb-4 leading-relaxed">{post.content}</p>
                                {post.imageUrl && (
                                    <img
                                        src={post.imageUrl}
                                        alt="post"
                                        className="w-full h-64 object-cover rounded-xl"
                                    />
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-4 text-slate-500 text-sm">
                                    <span className="flex items-center gap-1">
                                        <Heart size={14} /> {post.reactions}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageCircle size={14} /> {post.comments}
                                    </span>
                                </div>
                                {moderation?.aiReason && (
                                    <span className="text-[10px] text-slate-600 max-w-xs truncate italic">
                                        {moderation.aiReason}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}

                {filteredPosts.length === 0 && (
                    <div className="text-center py-16 text-slate-500">
                        <Activity size={40} className="mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No hay publicaciones en esta categoría</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Comunidad;