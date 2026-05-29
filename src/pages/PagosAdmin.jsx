import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { AlertCircle, Bell, FileText, Loader2 } from 'lucide-react';

const PagosAdmin = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPayment, setSelectedPayment] = useState(null); 

    const loadPayments = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/payments/all');
            setPayments(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Error al cargar pagos:", err);
            setPayments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadPayments(); }, []);

    const handleSendReminder = async (userId) => {
        try {
            await api.post(`/api/admin/payments/remind/${userId}`);
            alert("Notificación enviada al dispositivo del usuario.");
        } catch (err) { alert("Error al enviar notificación."); }
    };

    return (
        <div className="p-8 space-y-6 bg-[#0f172a] min-h-screen text-white">
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Pagos y Suscripciones</h1>

            {/* 1. KPIs SUPERIORES */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-700">
                    <div className="text-slate-400 text-xs uppercase">Pagos Completados</div>
                    <div className="text-2xl font-bold mt-2 text-emerald-400">S/ 59.80</div>
                </div>
                <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-700">
                    <div className="text-slate-400 text-xs uppercase">Pagos Pendientes</div>
                    <div className="text-2xl font-bold mt-2 text-amber-400">S/ 29.90</div>
                </div>
                <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-700">
                    <div className="text-slate-400 text-xs uppercase">Pagos Vencidos</div>
                    <div className="text-2xl font-bold mt-2 text-red-400">S/ 29.90</div>
                </div>
                <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-700">
                    <div className="text-slate-400 text-xs uppercase">Total Premium</div>
                    <div className="text-2xl font-bold mt-2 text-teal-400">4</div>
                </div>
            </div>

            {/* 2. ALERTA DE PAGOS VENCIDOS */}
            <div className="bg-[#1e293b] border border-red-500/20 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <AlertCircle className="text-red-500" />
                    <p className="text-sm">Hay usuarios con pagos vencidos. Se recomienda enviar recordatorios.</p>
                </div>
                <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-xs font-bold transition-all">
                    Enviar Recordatorios Masivos
                </button>
            </div>

            {/* 3. TABLA DETALLADA CON COLUMNA DE RECORDATORIO */}
            <div className="bg-[#1e293b] rounded-2xl border border-slate-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-800/50">
                        <tr>
                            <th className="px-6 py-4 text-xs text-slate-400">ID</th>
                            <th className="px-6 py-4 text-xs text-slate-400">Usuario</th>
                            <th className="px-6 py-4 text-xs text-slate-400">Plan</th>
                            <th className="px-6 py-4 text-xs text-slate-400">Monto</th>
                            <th className="px-6 py-4 text-xs text-slate-400">Estado</th>
                            <th className="px-6 py-4 text-xs text-slate-400">Recordatorio</th>
                            <th className="px-6 py-4 text-xs text-slate-400 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {loading ? (
                            <tr><td colSpan="7" className="p-10 text-center"><Loader2 className="animate-spin mx-auto"/></td></tr>
                        ) : payments.map(p => (
                            <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 text-sm font-mono text-slate-300">PAY-{p.id}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 font-bold text-xs">{p.user?.name.charAt(0)}</div>
                                        <div>
                                            <div className="text-sm font-semibold">{p.user?.name}</div>
                                            <div className="text-[10px] text-slate-500">{p.user?.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-700 rounded text-[10px]">Premium</span></td>
                                <td className="px-6 py-4 text-sm text-teal-400 font-bold">S/ {p.amount?.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${p.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {p.status}
                                    </span>
                                </td>
                                {/* 🟢 NUEVA COLUMNA DE RECORDATORIO PERSONALIZADO */}
                                <td className="px-6 py-4">
                                    {p.status !== 'COMPLETED' ? (
                                        <button onClick={() => handleSendReminder(p.user?.id)} className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded text-[10px] font-bold hover:bg-amber-500/20 transition-all">
                                            <Bell size={10} className="inline mr-1" /> Recordar
                                        </button>
                                    ) : <span className="text-[10px] text-slate-500 italic">No requerido</span>}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => setSelectedPayment(p)} className="px-3 py-1 bg-slate-700 border border-slate-600 rounded text-[10px] hover:bg-slate-600">
                                        <FileText size={10} className="inline mr-1" /> Ver Detalle
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL DETALLE */}
            {selectedPayment && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-[#1e293b] w-96 p-6 rounded-3xl border border-slate-700 shadow-2xl">
                        <h2 className="text-xl font-bold mb-4">Detalle de Pago PAY-{selectedPayment.id}</h2>
                        <div className="space-y-4">
                            <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-700">
                                <p className="text-[10px] text-slate-400 uppercase">Usuario</p>
                                <p className="text-sm font-bold">{selectedPayment.user?.name}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-700">
                                    <p className="text-[10px] text-slate-400 uppercase">Monto</p>
                                    <p className="text-sm font-bold text-teal-400">S/ {selectedPayment.amount?.toFixed(2)}</p>
                                </div>
                                <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-700">
                                    <p className="text-[10px] text-slate-400 uppercase">Estado</p>
                                    <p className="text-sm font-bold">{selectedPayment.status}</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setSelectedPayment(null)} className="w-full mt-6 py-2 bg-teal-600 hover:bg-teal-500 rounded-xl font-bold text-sm">Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PagosAdmin;