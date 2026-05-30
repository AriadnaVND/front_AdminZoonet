import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
    Ticket, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    Loader2,
    BellRing,
    X
} from 'lucide-react';

const Soporte = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const loadTickets = async () => {
        try {
            const res = await api.get('/admin/support/tickets');
            setTickets(res.data);
        } catch (error) {
            console.error("Error al cargar tickets", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadTickets(); }, []);

    const handleNotifyAndResolve = async () => {
        try {
            await api.post(`/admin/support/tickets/${selectedTicket.id}/resolve-and-notify`);
            setShowModal(false);
            loadTickets();
            showToast("Notificación enviada al usuario y ticket cerrado.");
        } catch (err) {
            console.error("Error al procesar:", err);
            showToast("No se pudo enviar la notificación.", "error");
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 text-teal-400">
            <Loader2 className="animate-spin mb-4" size={48} />
            <span className="text-slate-400 font-medium">Sincronizando soporte...</span>
        </div>
    );

    const abiertos = tickets.filter(t => t.status === 'OPEN').length;
    const enProgreso = tickets.filter(t => t.status === 'IN_PROGRESS').length;
    const resueltos = tickets.filter(t => t.status === 'CLOSED').length;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">

            {/* TÍTULO */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Gestión de Soporte</h1>
                    <p className="text-slate-400 text-xs mt-1">Administra tickets y emite avisos a los usuarios</p>
                </div>
                <div className="bg-teal-500 p-3 px-5 rounded-xl flex items-center gap-3 shadow-lg shadow-teal-500/20">
                    <Ticket size={18} className="text-white" />
                    <div className="leading-tight">
                        <p className="text-[9px] text-white/70 uppercase font-black tracking-widest">Total Tickets</p>
                        <p className="text-lg font-black text-white">{tickets.length}</p>
                    </div>
                </div>
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                        <div className="bg-teal-500/10 p-2.5 rounded-xl">
                            <Ticket className="text-teal-400" size={20} />
                        </div>
                        <span className="bg-teal-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{tickets.length}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Total Tickets</p>
                    <h3 className="text-2xl font-black text-white mt-1">{tickets.length}</h3>
                    <p className="text-[10px] text-slate-500 mt-1">En sistema</p>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 rounded-l-2xl" />
                </div>

                <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                        <div className="bg-rose-500/10 p-2.5 rounded-xl">
                            <AlertCircle className="text-rose-400" size={20} />
                        </div>
                        <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{abiertos}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Abiertos</p>
                    <h3 className="text-2xl font-black text-white mt-1">{abiertos}</h3>
                    <p className="text-[10px] text-rose-400 font-semibold mt-1">
                        {abiertos > 0 ? 'Requieren atención' : 'Sin alertas'}
                    </p>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 rounded-l-2xl" />
                </div>

                <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                        <div className="bg-emerald-500/10 p-2.5 rounded-xl">
                            <Clock className="text-emerald-400" size={20} />
                        </div>
                        <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{enProgreso}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">En Progreso</p>
                    <h3 className="text-2xl font-black text-white mt-1">{enProgreso}</h3>
                    <div className="mt-3 bg-[#0f172a] rounded-full h-1.5">
                        <div className="bg-emerald-500 h-1.5 rounded-full transition-all"
                            style={{ width: tickets.length > 0 ? `${(enProgreso / tickets.length) * 100}%` : '0%' }} />
                    </div>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-2xl" />
                </div>

                <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                        <div className="bg-blue-500/10 p-2.5 rounded-xl">
                            <CheckCircle2 className="text-blue-400" size={20} />
                        </div>
                        <span className="bg-blue-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{resueltos}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Resueltos</p>
                    <h3 className="text-2xl font-black text-white mt-1">{resueltos}</h3>
                    <p className="text-[10px] text-blue-400 font-semibold mt-1">Cerrados</p>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-2xl" />
                </div>

            </div>

            {/* TABLA */}
            <div className="bg-[#1e293b] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
                    <h3 className="text-white font-bold flex items-center gap-2 text-sm uppercase tracking-widest">
                        <Ticket className="text-red-400" size={18} /> Lista de Tickets
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-slate-500 text-[11px] uppercase tracking-widest font-black border-b border-slate-800 bg-slate-800/10">
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Asunto</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {tickets.map((t) => (
                                <tr key={t.id} className="hover:bg-slate-800/40 transition-all text-white group">
                                    <td className="px-6 py-5 text-xs font-mono text-teal-400 font-bold">TKT-00{t.id}</td>
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-bold text-white mb-0.5">{t.subject}</div>
                                        <div className="text-[11px] text-slate-500 italic line-clamp-1">"{t.description}"</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${
                                            t.status === 'CLOSED' 
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                                        }`}>
                                            {t.status === 'CLOSED' ? 'RESUELTO' : 'ABIERTO'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <button 
                                            onClick={() => { setSelectedTicket(t); setShowModal(true); }}
                                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all text-teal-400 hover:text-white flex items-center gap-2 mx-auto border border-slate-700 hover:border-teal-500/50 group/btn"
                                        >
                                            <BellRing size={16} className="group-hover/btn:animate-bounce" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Notificar</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1e293b] border border-slate-700 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
                            <h3 className="text-white font-bold flex items-center gap-2">
                                <BellRing className="text-teal-400" size={20} /> Gestionar Ticket
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 space-y-6 text-center">
                            <div className="space-y-2">
                                <p className="text-slate-300 text-sm">
                                    ¿Deseas cerrar el ticket{' '}
                                    <span className="text-teal-400 font-mono font-bold">TKT-00{selectedTicket?.id}</span>?
                                </p>
                                <p className="text-xs text-slate-500 italic">
                                    Esto enviará automáticamente un aviso a la sección de notificaciones del usuario en su App móvil.
                                </p>
                            </div>
                            <button 
                                onClick={handleNotifyAndResolve}
                                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
                            >
                                <BellRing size={18} /> ENVIAR NOTIFICACIÓN Y CERRAR
                            </button>
                            <button onClick={() => setShowModal(false)} className="w-full text-slate-500 font-bold text-xs py-2 hover:text-slate-300">
                                VOLVER ATRÁS
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TOAST */}
            {toast && (
                <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-bottom-4 duration-300 ${
                    toast.type === 'success'
                        ? 'bg-[#1e293b] border-teal-500/30 shadow-teal-500/10'
                        : 'bg-[#1e293b] border-rose-500/30 shadow-rose-500/10'
                }`}>
                    <div className={`p-2 rounded-xl ${toast.type === 'success' ? 'bg-teal-500/10' : 'bg-rose-500/10'}`}>
                        {toast.type === 'success'
                            ? <CheckCircle2 className="text-teal-400" size={18} />
                            : <AlertCircle className="text-rose-400" size={18} />
                        }
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                            {toast.type === 'success' ? 'Éxito' : 'Error'}
                        </p>
                        <p className="text-sm font-semibold text-white">{toast.message}</p>
                    </div>
                    <button onClick={() => setToast(null)} className="ml-2 text-slate-500 hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                </div>
            )}

        </div>
    );
};

export default Soporte;