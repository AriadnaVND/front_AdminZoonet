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
    
    // ESTADOS PARA EL MODAL
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showModal, setShowModal] = useState(false);

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
            alert("Notificación enviada al usuario y ticket cerrado.");
        } catch (err) {
            console.error("Error al procesar:", err);
            alert("No se pudo enviar la notificación.");
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 text-teal-400">
            <Loader2 className="animate-spin mb-4" size={48} />
            <span className="text-slate-400 font-medium">Sincronizando soporte...</span>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">
            {/* TÍTULO */}
            <div>
                <h1 className="text-3xl font-bold text-white">Gestión de Soporte</h1>
                <p className="text-slate-400 mt-1">Administra tickets y emite avisos a los usuarios</p>
            </div>

            {/* CARDS DE RESUMEN */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatusCard title="Total Tickets" value={tickets.length} iconColor="text-teal-400" icon={<Ticket size={20} />} />
                <StatusCard title="Abiertos" value={tickets.filter(t => t.status === 'OPEN').length} iconColor="text-red-400" icon={<AlertCircle size={20} />} />
                <StatusCard title="En Progreso" value={tickets.filter(t => t.status === 'IN_PROGRESS').length} iconColor="text-green-400" icon={<Clock size={20} />} />
                <StatusCard title="Resueltos" value={tickets.filter(t => t.status === 'CLOSED').length} iconColor="text-blue-400" icon={<CheckCircle2 size={20} />} />
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
                                            t.status === 'CLOSED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                                        }`}>
                                            {t.status === 'CLOSED' ? 'RESUELTO' : 'ABIERTO'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        {/* --- CAMBIO: Botón más descriptivo --- */}
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

            {/* --- MODAL DE ACCIÓN --- */}
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
                                <p className="text-slate-300 text-sm">¿Deseas cerrar el ticket <span className="text-teal-400 font-mono font-bold">TKT-00{selectedTicket?.id}</span>?</p>
                                <p className="text-xs text-slate-500 italic">Esto enviará automáticamente un aviso a la sección de notificaciones del usuario en su App móvil.</p>
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
        </div>
    );
};

const StatusCard = ({ title, value, icon, iconColor }) => (
    <div className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{title}</p>
            <h2 className="text-3xl font-black text-white">{value}</h2>
        </div>
        <div className={`w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center ${iconColor} border border-slate-700/50`}>
            {icon}
        </div>
    </div>
);

export default Soporte;