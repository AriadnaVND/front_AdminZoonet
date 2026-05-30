import React, { useEffect, useState, useMemo } from 'react';
import api from '../api/axios';
import { MapPin, Clock, Calendar, AlertCircle, Loader2, CheckCircle2, ClipboardList, Eye, X, Activity } from 'lucide-react';

const ReportesMascotas = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => {
        const fetchLostPets = async () => {
            try {
                const response = await api.get('/admin/reports/lost-pets');
                setReports(response.data);
            } catch (error) {
                console.error("Error al cargar reportes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLostPets();
    }, []);

    const stats = useMemo(() => {
        const hace30Dias = new Date();
        hace30Dias.setDate(hace30Dias.getDate() - 30);
        return {
            total: reports.length,
            perdidas: reports.filter(r => !r.found).length,
            encontradas: reports.filter(r => r.found).length,
            resueltos30d: reports.filter(r => r.found && new Date(r.reportDate) >= hace30Dias).length
        };
    }, [reports]);

    const handleViewDetails = (report) => {
        setSelectedReport(report);
        setShowModal(true);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 text-teal-500">
            <Loader2 className="animate-spin mb-2" size={40} />
            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Sincronizando Reportes...</span>
        </div>
    );

    return (
        <div className="p-6 space-y-6 bg-[#0f172a] min-h-screen text-slate-200">

            {/* HEADER */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Gestión de Reportes</h1>
                    <p className="text-slate-400 text-xs mt-1">Administra reportes de mascotas perdidas, encontradas y avistamientos</p>
                </div>
                <div className="bg-teal-500 p-3 px-5 rounded-xl flex items-center gap-3 shadow-lg shadow-teal-500/20">
                    <ClipboardList size={18} className="text-white" />
                    <div className="leading-tight">
                        <p className="text-[9px] text-white/70 uppercase font-black tracking-widest">Total Reportes</p>
                        <p className="text-lg font-black text-white">{stats.total}</p>
                    </div>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                        <div className="bg-teal-500/10 p-2.5 rounded-xl">
                            <ClipboardList className="text-teal-400" size={20} />
                        </div>
                        <span className="bg-teal-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{stats.total}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Reportes Activos</p>
                    <h3 className="text-2xl font-black text-white mt-1">{stats.total}</h3>
                    <p className="text-[10px] text-slate-500 mt-1">En sistema</p>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 rounded-l-2xl" />
                </div>

                <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                        <div className="bg-rose-500/10 p-2.5 rounded-xl">
                            <AlertCircle className="text-rose-400" size={20} />
                        </div>
                        <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{stats.perdidas}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Perdidas</p>
                    <h3 className="text-2xl font-black text-white mt-1">{stats.perdidas}</h3>
                    <p className="text-[10px] text-rose-400 font-semibold mt-1">
                        {stats.perdidas > 0 ? 'Requieren atención' : 'Sin alertas'}
                    </p>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 rounded-l-2xl" />
                </div>

                <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                        <div className="bg-emerald-500/10 p-2.5 rounded-xl">
                            <CheckCircle2 className="text-emerald-400" size={20} />
                        </div>
                        <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{stats.encontradas}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Encontradas</p>
                    <h3 className="text-2xl font-black text-white mt-1">{stats.encontradas}</h3>
                    <div className="mt-3 bg-[#0f172a] rounded-full h-1.5">
                        <div className="bg-emerald-500 h-1.5 rounded-full transition-all"
                            style={{ width: stats.total > 0 ? `${(stats.encontradas / stats.total) * 100}%` : '0%' }} />
                    </div>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-2xl" />
                </div>

                <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                        <div className="bg-blue-500/10 p-2.5 rounded-xl">
                            <CheckCircle2 className="text-blue-400" size={20} />
                        </div>
                        <span className="bg-blue-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{stats.resueltos30d}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Resueltos (30d)</p>
                    <h3 className="text-2xl font-black text-white mt-1">{stats.resueltos30d}</h3>
                    <p className="text-[10px] text-blue-400 font-semibold mt-1">Este mes</p>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-2xl" />
                </div>

            </div>

            {/* TABLA */}
            <div className="bg-[#1e293b] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">

                <div className="px-6 py-4 border-b border-slate-800/60 flex items-center gap-2 bg-slate-800/10">
                    <ClipboardList className="text-teal-400" size={18} />
                    <h2 className="font-bold text-white text-sm tracking-tight">Lista de Reportes</h2>
                </div>

                <div className="hidden md:grid grid-cols-7 px-6 py-3 bg-slate-800/30 border-b border-slate-800/50 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <div>ID</div>
                    <div className="col-span-2">Ubicación</div>
                    <div className="col-span-2">Descripción</div>
                    <div>Estado</div>
                    <div className="text-center">Acciones</div>
                </div>

                <div className="divide-y divide-slate-800/40">
                    {reports.length === 0 ? (
                        <div className="px-6 py-12 text-center text-slate-500">
                            <ClipboardList size={32} className="mx-auto mb-2 opacity-20" />
                            <p className="text-sm">No se encontraron reportes.</p>
                        </div>
                    ) : (
                        reports.map((r) => (
                            <div key={r.id} className="grid grid-cols-1 md:grid-cols-7 px-6 py-4 items-center hover:bg-slate-800/30 transition-all gap-4 md:gap-0">

                                {/* ID */}
                                <div>
                                    <span className="font-mono text-xs font-bold text-teal-400 bg-teal-500/5 px-2 py-1 rounded-lg border border-teal-500/10">
                                        RPT-{String(r.id).padStart(3, '0')}
                                    </span>
                                </div>

                                {/* Ubicación */}
                                <div className="col-span-2">
                                    <div className="flex items-center gap-1.5 text-sm font-bold text-slate-200">
                                        <MapPin size={13} className="text-rose-400 flex-shrink-0" />
                                        {r.lastSeenLocation || 'No especificada'}
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                                        {r.lastSeenLatitude?.toFixed(4) || '---'} / {r.lastSeenLongitude?.toFixed(4) || '---'}
                                    </p>
                                </div>

                                {/* Descripción */}
                                <div className="col-span-2">
                                    <p className="text-xs text-slate-400 italic truncate max-w-[240px]">
                                        "{r.description || 'Sin descripción adicional'}"
                                    </p>
                                    <div className="flex items-center gap-1 text-orange-400 text-[10px] font-bold mt-1">
                                        <Clock size={11} /> {r.hoursLost || 0} horas perdida
                                    </div>
                                </div>

                                {/* Estado */}
                                <div>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black border ${
                                        r.found
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                    }`}>
                                        <div className={`h-1.5 w-1.5 rounded-full ${r.found ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
                                        {r.found ? 'RESUELTO' : 'BUSCANDO'}
                                    </span>
                                </div>

                                {/* Acciones */}
                                <div className="flex justify-center">
                                    <button
                                        onClick={() => handleViewDetails(r)}
                                        className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-400 font-bold text-[10px] rounded-lg transition-all border border-slate-700 uppercase tracking-wider flex items-center gap-1.5"
                                    >
                                        <Eye size={12} /> Ver
                                    </button>
                                </div>

                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* MODAL */}
            {showModal && selectedReport && (
                <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1e293b] border border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-slate-200">

                        <div className="flex justify-between items-center mb-5">
                            <div className="flex items-center gap-2">
                                <ClipboardList size={18} className="text-teal-400" />
                                <div>
                                    <h2 className="font-black text-white text-md uppercase tracking-tight">
                                        Expediente RPT-{String(selectedReport.id).padStart(3, '0')}
                                    </h2>
                                    <p className="text-[10px] text-slate-500">Ficha de reporte interno</p>
                                </div>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white transition-colors p-1">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800/50 col-span-2">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Ubicación</p>
                                <p className="text-xs text-slate-200 font-medium flex items-center gap-1.5">
                                    <MapPin size={11} className="text-rose-400" />
                                    {selectedReport.lastSeenLocation || '---'}
                                </p>
                            </div>

                            <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800/50">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Coordenadas</p>
                                <p className="text-xs text-slate-300 font-mono">
                                    {selectedReport.lastSeenLatitude?.toFixed(4) || '---'}, {selectedReport.lastSeenLongitude?.toFixed(4) || '---'}
                                </p>
                            </div>

                            <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800/50">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Fecha</p>
                                <p className="text-xs text-slate-300 flex items-center gap-1">
                                    <Calendar size={11} className="text-blue-400" />
                                    {selectedReport.reportDate ? new Date(selectedReport.reportDate).toLocaleDateString() : '---'}
                                </p>
                            </div>

                            <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800/50">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Mascota ID</p>
                                <p className="text-white font-mono text-xs">#PET-{selectedReport.petId}</p>
                            </div>

                            <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800/50">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Estado</p>
                                <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider mt-0.5 ${
                                    selectedReport.found
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}>
                                    {selectedReport.found ? 'Resuelto' : 'Buscando'}
                                </span>
                            </div>

                            <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800/50 col-span-2">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Relato del Suceso</p>
                                <p className="text-slate-300 text-xs italic">
                                    "{selectedReport.description || 'Sin detalles adicionales.'}"
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowModal(false)}
                            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-black py-3 rounded-xl transition-all uppercase tracking-widest text-[10px]"
                        >
                            Cerrar Expediente
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportesMascotas;