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

    // Función auxiliar para normalizar el estado
    const isConnected = (status) => {
        const s = String(status).toUpperCase();
        return s === 'CONNECTED' || s === 'CONECTADO' || s === 'ONLINE';
    };

    const stats = useMemo(() => ({
        total: devices.length,
        online: devices.filter(d => isConnected(d.status)).length,
        offline: devices.filter(d => !isConnected(d.status)).length,
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
            {/* HEADER y STATS CARDS (se mantienen igual...) */}

            {/* TABLA */}
            <div className="bg-[#1e293b] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                {/* ... (Header de la tabla igual) ... */}

                <div className="divide-y divide-slate-800/40">
                    {filteredDevices.map((dev, idx) => {
                        const online = isConnected(dev.status);
                        return (
                            <div key={idx} className="grid grid-cols-1 md:grid-cols-4 px-6 py-4 items-center hover:bg-slate-800/30 transition-all gap-4 md:gap-0">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl ${online ? 'bg-emerald-500/10' : 'bg-slate-800'}`}>
                                        <Cpu size={16} className={online ? 'text-emerald-400' : 'text-slate-500'} />
                                    </div>
                                    <span className="font-mono text-xs font-bold text-teal-400 bg-teal-500/5 px-2 py-1 rounded-lg border border-teal-500/10">
                                        {dev.deviceId}
                                    </span>
                                </div>
                                {/* ... Mascota y Dueño (igual) ... */}
                                <div>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black border ${online
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                        }`}>
                                        <div className={`h-1.5 w-1.5 rounded-full ${online ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                                        {online ? 'ONLINE' : 'OFFLINE'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Collares;