import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { CheckCircle, AlertCircle, Zap, Loader2 } from 'lucide-react';

const PagosAdmin = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Carga inicial de transacciones desde la base de datos de Railway
    const loadPayments = async () => {
        try {
            // Se sincroniza con el endpoint real del backend de administrador
            const res = await api.get('/admin/payments/all');
            setPayments(res.data);
        } catch (err) {
            console.error("Error al cargar pagos:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPayments();
    }, []);

    // Función para aprobar el pago y activar automáticamente el Plan Premium
    const handleApprove = async (paymentId) => {
        const confirmApproval = window.confirm(
            "¿Deseas confirmar este pago y activar automáticamente el Plan Premium para este usuario?"
        );
        
        if (!confirmApproval) return;
        
        try {
            // Llama al endpoint especializado que actualiza el estado del pago y el plan del usuario
            await api.post(`/admin/payments/${paymentId}/approve`);
            alert("Pago procesado y suscripción Premium activada con éxito.");
            loadPayments(); // Recarga la tabla para reflejar el nuevo estado 'COMPLETED'
        } catch (err) {
            console.error("Error al procesar la aprobación:", err);
            alert("No se pudo procesar la aprobación. Verifica la conexión con el servidor.");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-teal-400">
                <Loader2 className="animate-spin mb-4" size={48} />
                <span className="text-slate-400 font-medium">Sincronizando transacciones con Railway...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold text-white tracking-tight">Control de Pagos (Suscripciones)</h1>
            
            <div className="bg-[#1e293b] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-slate-500 text-[11px] uppercase font-black tracking-widest bg-slate-800/30">
                            <th className="px-6 py-4">ID Transacción</th>
                            <th className="px-6 py-4">Usuario</th>
                            <th className="px-6 py-4">Monto</th>
                            <th className="px-6 py-4 text-center">Estado</th>
                            <th className="px-6 py-4 text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {payments.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-800/40 transition-all text-white group">
                                <td className="px-6 py-5 font-mono text-xs text-slate-400">
                                    {/* Muestra el ID real o el transaction_id si existe */}
                                    #PAY-00{p.id}
                                </td>
                                <td className="px-6 py-5 font-medium">
                                    {/* Muestra datos reales del usuario vinculado al pago */}
                                    <div className="text-sm text-white">
                                        {p.user?.name || `Usuario ID: ${p.userId}`}
                                    </div>
                                    <div className="text-[10px] text-slate-500">
                                        {p.user?.email || "Email no disponible"}
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-teal-400 font-black">
                                    S/ {p.amount ? p.amount.toFixed(2) : "0.00"}
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black border ${
                                        p.status === 'COMPLETED' 
                                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                    }`}>
                                        {p.status === 'COMPLETED' ? <CheckCircle size={12}/> : <AlertCircle size={12}/>}
                                        {p.status === 'COMPLETED' ? 'COMPLETADO' : (p.status || 'PENDIENTE')}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    {/* El botón solo aparece si el pago no está completado */}
                                    {p.status !== 'COMPLETED' && (
                                        <button 
                                            onClick={() => handleApprove(p.id)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-[10px] font-bold transition-all uppercase tracking-wider shadow-lg shadow-teal-900/20"
                                        >
                                            <Zap size={14}/> Aprobar y Activar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {payments.length === 0 && (
                    <div className="p-20 text-center text-slate-500 italic">
                        No hay transacciones registradas en la base de datos de Railway.
                    </div>
                )}
            </div>
        </div>
    );
};

export default PagosAdmin;