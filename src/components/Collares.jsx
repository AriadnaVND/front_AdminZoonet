import React, { useEffect, useState, useMemo } from 'react';
import api from '../api/axios';
import { Search, Loader2, Wifi, WifiOff, Cpu, Heart, Radio, Activity } from 'lucide-react';

const Collares = ({ onDataLoad }) => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchDevices = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/devices/status-report');
            setDevices(res.data);
            if (onDataLoad) onDataLoad(res.data);
        } catch (error) {
            console.error("Error IoT:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDevices(); }, []);

    const stats = useMemo(() => ({
        total: devices.length,
        online: devices.filter(d => d.status === 'CONNECTED').length,
        offline: devices.filter(d => d.status !== 'CONNECTED').length,
        conMascota: devices.filter(d => d.petName && d.petName !== 'Sin asignar').length,
    }), [devices]);

    const filteredDevices = devices.filter(dev =>
        dev.petName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dev.deviceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dev.ownerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 text-teal-500">
            <Loader2 className="animate-spin mb-2" size={40} />
            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Sincronizando Hardware...</span>
        </div>
    );

    return (
        <div className="p-6 space-y-6 bg-[#0f172a] min-h-screen text-slate-200">

            {/* HEADER */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Collares IoT</h1>
                    <p className="text-slate-400 text-xs mt-1">Monitoreo en tiempo real de hardware vinculado a mascotas</p>
                </div>
                <div className="bg-teal-500 p-3 px-5 rounded-xl flex items-center gap-3 shadow-lg shadow-teal-500/20">
                    <Radio size={18} className="text-white" />
                    <div className="leading-tight">
                        <p className="text-[9px] text-white/70 uppercase font-black tracking-widest">Dispositivos</p>
                        <p className="text-lg font-black text-white">{stats.total}</p>
                    </div>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                        <div className="bg-teal-500/10 p-2.5 rounded-xl">
                            <Cpu className="text-teal-400" size={20} />
                        </div>
                        <span className="bg-teal-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{stats.total}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Total Hardware</p>
                    <h3 className="text-2xl font-black text-white mt-1">{stats.total}</h3>
                    <p className="text-[10px] text-slate-500 mt-1">Registrados</p>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 rounded-l-2xl" />
                </div>

                <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                        <div className="bg-emerald-500/10 p-2.5 rounded-xl">
                            <Wifi className="text-emerald-400" size={20} />
                        </div>
                        <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{stats.online}/{stats.total}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Online</p>
                    <h3 className="text-2xl font-black text-white mt-1">{stats.online}</h3>
                    <div className="mt-3 bg-[#0f172a] rounded-full h-1.5">
                        <div className="bg-emerald-500 h-1.5 rounded-full transition-all"
                            style={{ width: stats.total > 0 ? `${(stats.online / stats.total) * 100}%` : '0%' }} />
                    </div>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-2xl" />
                </div>

                <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                        <div className="bg-rose-500/10 p-2.5 rounded-xl">
                            <WifiOff className="text-rose-400" size={20} />
                        </div>
                        <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{stats.offline}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Offline</p>
                    <h3 className="text-2xl font-black text-white mt-1">{stats.offline}</h3>
                    <p className="text-[10px] text-rose-400 font-semibold mt-1">
                        {stats.offline > 0 ? 'Requieren atención' : 'Sin alertas'}
                    </p>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 rounded-l-2xl" />
                </div>

                <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                        <div className="bg-purple-500/10 p-2.5 rounded-xl">
                            <Heart className="text-purple-400" size={20} />
                        </div>
                        <span className="bg-slate-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{stats.conMascota}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Con Mascota</p>
                    <h3 className="text-2xl font-black text-white mt-1">{stats.conMascota}</h3>
                    <p className="text-[10px] text-slate-500 mt-1">Vinculados</p>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 rounded-l-2xl" />
                </div>

            </div>

            {/* TABLA */}
            <div className="bg-[#1e293b] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800/60 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between bg-slate-800/10">
                    <div className="flex items-center gap-2">
                        <Activity className="text-teal-400" size={18} />
                        <h2 className="font-bold text-white text-sm tracking-tight">Registros de Dispositivos</h2>
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                        <input
                            type="text"
                            placeholder="Buscar por ID, mascota o dueño..."
                            className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:border-teal-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="hidden md:grid grid-cols-4 px-6 py-3 bg-slate-800/30 border-b border-slate-800/50 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <div>ID Hardware</div>
                    <div>Mascota</div>
                    <div>Dueño</div>
                    <div>Estado</div>
                </div>

                <div className="divide-y divide-slate-800/40">
                    {filteredDevices.length === 0 ? (
                        <div className="px-6 py-12 text-center text-slate-500">
                            <Cpu size={32} className="mx-auto mb-2 opacity-20" />
                            <p className="text-sm">No se encontraron dispositivos vinculados.</p>
                        </div>
                    ) : (
                        filteredDevices.map((dev, idx) => (
                            <div key={idx} className="grid grid-cols-1 md:grid-cols-4 px-6 py-4 items-center hover:bg-slate-800/30 transition-all gap-4 md:gap-0">

                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl ${dev.status === 'CONNECTED' ? 'bg-emerald-500/10' : 'bg-slate-800'}`}>
                                        <Cpu size={16} className={dev.status === 'CONNECTED' ? 'text-emerald-400' : 'text-slate-500'} />
                                    </div>
                                    <span className="font-mono text-xs font-bold text-teal-400 bg-teal-500/5 px-2 py-1 rounded-lg border border-teal-500/10">
                                        {dev.deviceId}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-xl bg-[#0f172a] border border-slate-800 flex items-center justify-center text-lg">
                                        🐾
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm uppercase tracking-tight">
                                            {dev.petName || 'Sin asignar'}
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-mono">Collar IoT</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-slate-300 text-xs truncate max-w-[200px]">
                                        {dev.ownerEmail || 'Sin dueño'}
                                    </p>
                                </div>

                                <div>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black border ${
                                        dev.status === 'CONNECTED'
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                    }`}>
                                        <div className={`h-1.5 w-1.5 rounded-full ${dev.status === 'CONNECTED' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                                        {dev.status === 'CONNECTED' ? 'ONLINE' : 'OFFLINE'}
                                    </span>
                                </div>

                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Collares;