import React, { useEffect, useState, useMemo } from 'react';
import api from '../api/axios';
import { 
    AlertCircle, Bell, Loader2, 
    CheckCircle, Crown, CreditCard, Search, 
    ChevronDown, X, TrendingUp, AlertTriangle, Clock, Mail
} from 'lucide-react';

const PagosAdmin = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        loadPayments();
        const handleClick = () => setShowDropdown(false);
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

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

    const handleSendReminder = async (userId) => {
        try {
            await api.post(`/api/admin/payments/remind/${userId}`);
            alert("Notificación enviada al dispositivo.");
        } catch { alert("Error al enviar notificación."); }
    };

    const handleSendMassReminders = async () => {
        try {
            await api.post('/api/admin/payments/remind-all');
            alert("Recordatorios masivos enviados.");
        } catch { alert("Error al enviar recordatorios."); }
    };

    const handleEnviarFactura = (payment) => {
        const email = payment.user?.email;
        if (!email) return alert("El usuario no tiene correo registrado.");
        const asunto = encodeURIComponent(
            `Factura de Suscripción Premium - ZooNet PAY-${String(payment.id).padStart(3, '0')}`
        );
        const cuerpo = encodeURIComponent(
            `Estimado/a ${payment.user?.name || 'usuario'},\n\n` +
            `Adjuntamos el detalle de su suscripción Premium en ZooNet.\n\n` +
            `• Referencia: PAY-${String(payment.id).padStart(3, '0')}\n` +
            `• Plan: Premium\n` +
            `• Monto: S/. ${payment.amount?.toFixed(2)}\n` +
            `• Estado: ${getStatusLabel(payment.status)}\n` +
            (payment.nextPaymentDate ? `• Próximo pago: ${payment.nextPaymentDate}\n` : '') +
            `\nGracias por ser parte de ZooNet.\n\nAtentamente,\nEquipo ZooNet`
        );
        window.open(
            `https://mail.google.com/mail/?view=cm&to=${email}&su=${asunto}&body=${cuerpo}`,
            '_blank'
        );
    };

    const stats = useMemo(() => {
        const completed = payments.filter(p => p.status === 'COMPLETED');
        const pending   = payments.filter(p => p.status === 'PENDING');
        const overdue   = payments.filter(p => p.status === 'OVERDUE' || p.status === 'FAILED');
        return {
            completadoMonto: completed.reduce((s, p) => s + (p.amount || 0), 0),
            completadoCount: completed.length,
            pendienteMonto:  pending.reduce((s, p) => s + (p.amount || 0), 0),
            pendienteCount:  pending.length,
            vencidoMonto:    overdue.reduce((s, p) => s + (p.amount || 0), 0),
            vencidoCount:    overdue.length,
            totalPremium:    payments.length,
            ingresosMes:     completed.reduce((s, p) => s + (p.amount || 0), 0)
        };
    }, [payments]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'COMPLETED': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
            case 'PENDING':   return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
            case 'OVERDUE':
            case 'FAILED':    return 'bg-red-500/20 text-red-400 border border-red-500/30';
            default:          return 'bg-slate-700 text-slate-400';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'COMPLETED': return 'Pagado';
            case 'PENDING':   return 'Pendiente';
            case 'OVERDUE':   return 'Vencido';
            case 'FAILED':    return 'Fallido';
            default:          return status;
        }
    };

    const filteredPayments = payments.filter(p => {
        const matchesStatus =
            filterStatus === 'ALL' ||
            (filterStatus === 'PAGADOS'    && p.status === 'COMPLETED') ||
            (filterStatus === 'PENDIENTES' && p.status === 'PENDING') ||
            (filterStatus === 'VENCIDOS'   && (p.status === 'OVERDUE' || p.status === 'FAILED'));

        const term = searchTerm.toLowerCase();
        const matchesSearch = !term ||
            p.user?.name?.toLowerCase().includes(term) ||
            `pay-${p.id}`.includes(term);

        return matchesStatus && matchesSearch;
    });

    const filterLabel = {
        ALL: 'Todos', PAGADOS: 'Pagados', PENDIENTES: 'Pendientes', VENCIDOS: 'Vencidos'
    }[filterStatus];

    return (
        <div className="p-6 space-y-6 bg-[#0f172a] min-h-screen text-white animate-in fade-in duration-500">

            {/* HEADER */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Gestión de Pagos y Suscripciones</h1>
                    <p className="text-slate-400 text-xs mt-1">Administra pagos, suscripciones y facturación de usuarios</p>
                </div>
                <div className="bg-teal-500 p-3 px-5 rounded-xl flex items-center gap-3 shadow-lg shadow-teal-500/20">
                    <TrendingUp size={18} />
                    <div className="leading-tight">
                        <p className="text-[9px] uppercase font-bold tracking-widest opacity-80">Ingresos del Mes</p>
                        <p className="text-lg font-black">S/. {stats.ingresosMes.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* TABS (Solo Premium) */}
            <div className="flex gap-3">
                <button className="flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs bg-teal-500 text-white shadow-lg shadow-teal-500/20 uppercase tracking-wide">
                    <Crown size={14} /> Premium
                    <span className="bg-white/20 px-2 py-0.5 rounded-md text-[10px] font-black">{stats.totalPremium}</span>
                </button>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                        <div className="bg-emerald-500/10 p-2.5 rounded-xl">
                            <CheckCircle className="text-emerald-500" size={20} />
                        </div>
                        <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                            {stats.completadoCount}/{stats.totalPremium}
                        </span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Pagos Completados</p>
                    <h3 className="text-2xl font-black text-white mt-1">S/. {stats.completadoMonto.toFixed(2)}</h3>
                    <div className="mt-3 bg-[#0f172a] rounded-full h-1.5">
                        <div className="bg-emerald-500 h-1.5 rounded-full transition-all"
                            style={{ width: stats.totalPremium > 0 ? `${(stats.completadoCount / stats.totalPremium) * 100}%` : '0%' }} />
                    </div>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-2xl" />
                </div>

                <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                        <div className="bg-amber-500/10 p-2.5 rounded-xl">
                            <Clock className="text-amber-500" size={20} />
                        </div>
                        <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                            {stats.pendienteCount}
                        </span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Pagos Pendientes</p>
                    <h3 className="text-2xl font-black text-white mt-1">S/. {stats.pendienteMonto.toFixed(2)}</h3>
                    <p className="text-[11px] text-slate-500 mt-2">{stats.pendienteCount} usuario{stats.pendienteCount !== 1 ? 's' : ''}</p>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-l-2xl" />
                </div>

                <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                        <div className="bg-red-500/10 p-2.5 rounded-xl">
                            <AlertTriangle className="text-red-400" size={20} />
                        </div>
                        <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                            {stats.vencidoCount}
                        </span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Pagos Vencidos</p>
                    <h3 className="text-2xl font-black text-white mt-1">S/. {stats.vencidoMonto.toFixed(2)}</h3>
                    <p className="text-[11px] text-red-400 font-semibold mt-2">Requiere atención</p>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-2xl" />
                </div>

                <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                        <div className="bg-teal-500/10 p-2.5 rounded-xl">
                            <Crown className="text-teal-400" size={20} />
                        </div>
                        <span className="bg-teal-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                            {stats.totalPremium}
                        </span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Total Premium</p>
                    <h3 className="text-2xl font-black text-white mt-1">{stats.totalPremium}</h3>
                    <p className="text-[11px] text-slate-500 mt-2">Usuarios activos</p>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 rounded-l-2xl" />
                </div>

            </div>

            {/* ALERTA VENCIDOS */}
            {stats.vencidoCount > 0 && (
                <div className="bg-[#1e293b] border border-red-500/20 p-5 rounded-2xl">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="bg-red-500/10 p-2 rounded-lg flex-shrink-0">
                                <AlertTriangle className="text-red-400" size={18} />
                            </div>
                            <div>
                                <p className="text-red-400 font-black text-sm flex items-center gap-2">
                                    Pagos Vencidos Pendientes
                                    <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                                        {stats.vencidoCount}
                                    </span>
                                </p>
                                <p className="text-slate-400 text-xs mt-1">
                                    Hay {stats.vencidoCount} usuario{stats.vencidoCount !== 1 ? 's' : ''} con pagos vencidos
                                    por un total de S/. {stats.vencidoMonto.toFixed(2)}. Se recomienda enviar recordatorios de pago.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleSendMassReminders}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex-shrink-0 shadow-lg shadow-red-500/20"
                        >
                            <Mail size={13} /> Enviar Recordatorios Masivos
                        </button>
                    </div>
                </div>
            )}

            {/* TABLA */}
            <div className="bg-[#1e293b] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">

                <div className="px-6 py-4 border-b border-slate-800/60 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between bg-slate-800/10">
                    <div className="flex items-center gap-2">
                        <CreditCard className="text-teal-400" size={18} />
                        <h2 className="font-bold text-white text-sm">Lista de Pagos y Suscripciones Premium</h2>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-56">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                            <input
                                placeholder="Buscar pago..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-[#0f172a] border border-slate-800 text-white pl-9 pr-4 py-2 rounded-xl outline-none focus:border-teal-500 text-xs transition-all"
                            />
                        </div>
                        <div className="relative">
                            <button
                                onClick={e => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
                                className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] border border-slate-800 rounded-xl text-xs text-slate-300 font-bold uppercase tracking-wider hover:border-slate-700 transition-all"
                            >
                                {filterLabel}
                                <ChevronDown size={13} className={`text-slate-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                            </button>
                            {showDropdown && (
                                <div className="absolute right-0 top-full mt-2 bg-[#1e293b] border border-slate-800 rounded-xl shadow-2xl z-10 min-w-[140px] overflow-hidden">
                                    {[['ALL','Todos'],['PAGADOS','Pagados'],['PENDIENTES','Pendientes'],['VENCIDOS','Vencidos']].map(([val, label]) => (
                                        <button key={val}
                                            onClick={e => { e.stopPropagation(); setFilterStatus(val); setShowDropdown(false); }}
                                            className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors flex items-center justify-between ${
                                                filterStatus === val
                                                    ? 'bg-[#0f172a] text-teal-400 font-bold'
                                                    : 'text-slate-400 hover:bg-[#0f172a]/50 hover:text-slate-200'
                                            }`}
                                        >
                                            {label}
                                            {filterStatus === val && <CheckCircle size={13} className="text-teal-400" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Encabezados */}
                <div className="hidden md:grid grid-cols-6 px-6 py-3 bg-slate-800/30 border-b border-slate-800/50 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <div>ID</div>
                    <div className="col-span-2">Usuario</div>
                    <div>Monto</div>
                    <div>Estado</div>
                    <div className="text-right">Acciones</div>
                </div>

                {/* Filas */}
                <div className="divide-y divide-slate-800/40">
                    {loading ? (
                        <div className="p-10 text-center">
                            <Loader2 className="animate-spin mx-auto text-teal-400" size={24} />
                        </div>
                    ) : filteredPayments.length === 0 ? (
                        <div className="p-10 text-center text-slate-500 text-sm">
                            No se encontraron pagos
                        </div>
                    ) : filteredPayments.map(p => (
                        <div key={p.id} className="grid grid-cols-1 md:grid-cols-6 px-6 py-4 items-center hover:bg-slate-800/30 transition-all gap-3 md:gap-0">

                            <div className="text-xs font-mono text-slate-400">
                                PAY-{String(p.id).padStart(3, '0')}
                            </div>

                            <div className="md:col-span-2 flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm border ${
                                    p.status === 'COMPLETED'
                                        ? 'bg-teal-500/10 border-teal-500/30 text-teal-400'
                                        : 'bg-slate-800 border-slate-700 text-slate-400'
                                }`}>
                                    {p.user?.name ? p.user.name.charAt(0).toUpperCase() : '?'}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">{p.user?.name || 'Sin nombre'}</p>
                                    <p className="text-[10px] text-slate-500">{p.user?.email || '—'}</p>
                                </div>
                            </div>

                            <div className="font-black text-teal-400 text-sm">
                                S/. {p.amount?.toFixed(2) ?? '—'}
                            </div>

                            <div>
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${getStatusStyle(p.status)}`}>
                                    {getStatusLabel(p.status)}
                                </span>
                            </div>

                            <div className="flex items-center justify-end gap-2">
                                {p.status !== 'COMPLETED' && (
                                    <button
                                        onClick={() => handleSendReminder(p.user?.id)}
                                        className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg text-[10px] font-bold hover:bg-amber-500/20 transition-all flex items-center gap-1"
                                    >
                                        <Bell size={10} /> Recordar
                                    </button>
                                )}
                                <button
                                    onClick={() => setSelectedPayment(p)}
                                    className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-[10px] font-bold hover:bg-slate-700 transition-all flex items-center gap-1"
                                >
                                    <CreditCard size={10} /> Ver
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            </div>

            {/* MODAL DETALLE */}
            {selectedPayment && (
                <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1e293b] border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">

                        <div className="flex justify-between items-start mb-5">
                            <div className="flex items-center gap-2">
                                <CreditCard className="text-teal-400" size={18} />
                                <div>
                                    <h2 className="font-black text-white text-md">
                                        Detalle de Pago PAY-{String(selectedPayment.id).padStart(3, '0')}
                                    </h2>
                                    <p className="text-[10px] text-slate-500">Información completa de la suscripción Premium</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedPayment(null)} className="text-slate-500 hover:text-white p-1 transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modificado: Se eliminó la tarjeta / grid-item de Próximo Pago para limpiar espacio y reajustar layout a 1 columna para que luzca estético */}
                        <div className="grid grid-cols-1 gap-3 mb-5">

                            <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800">
                                <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Usuario</p>
                                <p className="text-sm font-bold text-white">{selectedPayment.user?.name || 'Sin nombre'}</p>
                            </div>

                            <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800">
                                <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Plan</p>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-teal-500/10 text-teal-400 border border-teal-500/20 uppercase">
                                    <Crown size={9} /> Premium
                                </span>
                            </div>

                            <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800">
                                <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Monto</p>
                                <p className="text-lg font-black text-teal-400">S/. {selectedPayment.amount?.toFixed(2) ?? '—'}</p>
                            </div>

                            <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800">
                                <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Estado</p>
                                <span className={`inline-block px-2 py-0.5 rounded-lg text-[10px] font-black uppercase mt-0.5 ${getStatusStyle(selectedPayment.status)}`}>
                                    {getStatusLabel(selectedPayment.status)}
                                </span>
                            </div>

                            <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800">
                                <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Método de Pago</p>
                                <p className="text-sm text-slate-300 font-medium">
                                    {selectedPayment.paymentMethod || 'Tarjeta'}
                                </p>
                            </div>

                        </div>

                        <div className="flex justify-end">
                            {/* Modificado: Se removió el botón "Marcar como Pagado" y su función vinculada. El botón de enviar factura ahora toma todo el ancho o se acomoda de forma balanceada */}
                            <button
                                onClick={() => handleEnviarFactura(selectedPayment)}
                                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black py-3 rounded-xl transition-all text-xs uppercase tracking-wider border border-slate-700"
                            >
                                <Mail size={14} /> Enviar Factura
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default PagosAdmin;