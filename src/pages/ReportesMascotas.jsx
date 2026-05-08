import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { MapPin, Clock, Calendar, AlertCircle, Loader2, CheckCircle2, ClipboardList, Eye } from 'lucide-react';

const ReportesMascotas = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 text-teal-400">
            <Loader2 className="animate-spin mb-4" size={48} />
            <span className="text-slate-400 font-medium">Sincronizando con Railway...</span>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* TÍTULO Y DESCRIPCIÓN */}
            <div>
                <h1 className="text-3xl font-bold text-white">Gestión de Reportes</h1>
                <p className="text-slate-400 mt-1">Administra reportes de mascotas perdidas, encontradas y avistamientos</p>
            </div>

            {/* CARDS DE RESUMEN (Estilo Figma) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Total de reportes en BD */}
                <SummaryCard title="Reportes Activos" value={reports.length} color="text-teal-400" bg="bg-teal-400/10" icon={<ClipboardList/>} />
                
                {/* Los que aún no se encuentran */}
                <SummaryCard title="Perdidas" value={reports.filter(r => !r.found).length} color="text-red-400" bg="bg-red-400/10" icon={<AlertCircle/>} />
                
                {/* Los que ya marcaste como encontrados en BD */}
                <SummaryCard title="Encontradas" value={reports.filter(r => r.found).length} color="text-green-400" bg="bg-green-400/10" icon={<CheckCircle2/>} />
                
                {/* EL "3" ACORDADO XD */}
                <SummaryCard title="Resueltos (30d)" value="3" color="text-blue-400" bg="bg-blue-400/10" icon={<CheckCircle2/>} />
            </div>

            {/* LISTA DE REPORTES */}
            <div className="bg-[#1e293b] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-800 bg-slate-800/30">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <ClipboardList className="text-red-400" size={20} /> Lista de Reportes
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-slate-500 text-[11px] uppercase tracking-widest font-black border-b border-slate-800 bg-slate-800/10">
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Ubicación y Coordenadas</th>
                                <th className="px-6 py-4">Descripción del Suceso</th>
                                <th className="px-6 py-4">Tiempo Perdido</th>
                                <th className="px-6 py-4">Mascota ID</th>
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {reports.map((r) => (
                                <tr key={r.id} className="hover:bg-slate-800/40 transition-all text-white group">
                                    <td className="px-6 py-5 font-mono text-teal-400 text-xs font-bold">RPT-00{r.id}</td>
                                    
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                                            <MapPin size={14} className="text-red-400" />
                                            {r.lastSeenLocation || "No especificada"}
                                        </div>
                                        <div className="text-[10px] text-slate-500 mt-1 font-mono">
                                            LAT: {r.lastSeenLatitude?.toFixed(4) || "---"} | LON: {r.lastSeenLongitude?.toFixed(4) || "---"}
                                        </div>
                                    </td>

                                    <td className="px-6 py-5 text-xs text-slate-300 max-w-xs italic">
                                        "{r.description || "Sin descripción adicional"}"
                                    </td>

                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1 text-orange-400 text-[10px] font-bold">
                                                <Clock size={12} /> {r.hoursLost || 0} HORAS
                                            </div>
                                            <span className={`text-[9px] px-2 py-0.5 rounded-full border w-fit font-bold ${r.found ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                {r.found ? 'RESUELTO' : 'BUSCANDO'}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-5">
                                        <span className="bg-slate-800 px-3 py-1.5 rounded-xl text-[10px] font-black border border-slate-700 text-slate-300">
                                            #PET-{r.petId}
                                        </span>
                                    </td>

                                    <td className="px-6 py-5 text-sm text-slate-400">
                                        <div className="flex items-center gap-1 text-xs">
                                            <Calendar size={13} className="text-slate-500" />
                                            {r.reportDate ? new Date(r.reportDate).toLocaleDateString() : '---'}
                                        </div>
                                    </td>

                                    <td className="px-6 py-5 text-center">
                                        <button className="p-2 hover:bg-slate-700 rounded-xl transition-all text-slate-400 hover:text-white flex items-center gap-2 mx-auto border border-transparent hover:border-slate-600">
                                            <Eye size={16} />
                                            <span className="text-[10px] font-bold">Ver</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {reports.length === 0 && (
                    <div className="text-center py-20 text-slate-500 italic">
                        No hay reportes registrados en la base de datos de Zoonet.
                    </div>
                )}
            </div>
        </div>
    );
};

// Componente para las Cards de resumen
const SummaryCard = ({ title, value, color, bg, icon }) => (
    <div className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800 flex justify-between items-start transition-all hover:border-slate-700 shadow-lg">
        <div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">{title}</p>
            <h2 className={`text-3xl font-black text-white`}>{value}</h2>
        </div>
        <div className={`${bg} ${color} p-3 rounded-2xl`}>
            {React.cloneElement(icon, { size: 24 })}
        </div>
    </div>
);

export default ReportesMascotas;