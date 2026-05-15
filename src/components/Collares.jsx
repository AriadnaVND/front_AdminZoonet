import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Battery, MapPin, Search, Loader2, Wifi, MoreHorizontal } from 'lucide-react';

const Collares = ({ onDataLoad }) => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchDevices = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/devices/status-report');
            setDevices(res.data);
            // ENVIAR DATA AL PADRE PARA ACTUALIZAR LOS CUADROS
            if (onDataLoad) onDataLoad(res.data); 
        } catch (error) {
            console.error("Error IoT:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDevices(); }, []);

    const filteredDevices = devices.filter(dev => 
        dev.petName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dev.deviceId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Funciones para botones
    const handleTrack = (id) => alert(`Rastreando dispositivo: ${id}`);
    const handleActions = (id) => console.log(`Acciones para: ${id}`);

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 text-teal-500">
            <Loader2 className="animate-spin mb-2" size={40} />
            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Sincronizando Hardware...</span>
        </div>
    );

    return (
        <div className="bg-[#1e293b] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
            {/* Header de la tabla */}
            <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/20">
                <div className="flex items-center gap-2">
                    <div className="h-5 w-1 bg-teal-500 rounded-full"></div>
                    <h2 className="text-lg font-bold text-white">Lista de Dispositivos</h2>
                </div>
                
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input 
                        type="text"
                        placeholder="Buscar por ID o mascota..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-teal-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-900/40 text-slate-500 text-[10px] uppercase font-black tracking-widest">
                        <tr>
                            <th className="px-6 py-5">ID Hardware</th>
                            <th className="px-6 py-5">Mascota / Dueño</th>
                            <th className="px-6 py-5">Estado</th>
                            <th className="px-6 py-5">Batería</th>
                            <th className="px-6 py-5">Ubicación</th>
                            <th className="px-6 py-5 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {filteredDevices.map((dev, idx) => (
                            <tr key={idx} className="hover:bg-slate-800/40 transition-colors group">
                                <td className="px-6 py-5">
                                    <span className="font-mono text-xs font-bold text-teal-400 bg-teal-500/5 px-2 py-1 rounded border border-teal-500/10">
                                        {dev.deviceId}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="text-sm font-bold text-white">{dev.petName || 'Sin asignar'}</div>
                                    <div className="text-[10px] text-slate-500 italic">{dev.ownerEmail || 'Sin dueño'}</div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black border ${
                                        dev.status === 'CONNECTED' 
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                    }`}>
                                        <div className={`h-1.5 w-1.5 rounded-full ${dev.status === 'CONNECTED' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                                        {dev.status === 'CONNECTED' ? 'ONLINE' : 'OFFLINE'}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col gap-1.5 w-24">
                                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                                            <Battery size={12} className={dev.status === 'CONNECTED' ? 'text-emerald-500' : 'text-slate-600'}/> 
                                            <span>{dev.status === 'CONNECTED' ? (dev.batteryLevel || '85%') : '0%'}</span>
                                        </div>
                                        <div className="w-full bg-slate-800 h-1.5 rounded-full">
                                            <div 
                                                className={`${dev.status === 'CONNECTED' ? 'bg-emerald-500' : 'bg-slate-700'} h-1.5 rounded-full transition-all duration-500`} 
                                                style={{width: dev.status === 'CONNECTED' ? (dev.batteryLevel || '85%') : '0%'}}
                                            ></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <button 
                                        onClick={() => handleTrack(dev.deviceId)}
                                        className="flex items-center gap-2 text-slate-300 text-xs font-bold hover:text-teal-400 transition-colors bg-slate-900/50 px-3 py-2 rounded-xl border border-slate-700 hover:border-teal-500/50"
                                    >
                                        <MapPin size={14} className="text-teal-500"/>
                                        Rastrear
                                    </button>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <button 
                                        onClick={() => handleActions(dev.deviceId)}
                                        className="text-slate-500 hover:text-white p-2 hover:bg-slate-700 rounded-lg transition-all"
                                    >
                                        <MoreHorizontal size={20}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredDevices.length === 0 && (
                <div className="p-10 text-center text-slate-500 italic text-sm">
                    No se encontraron dispositivos vinculados.
                </div>
            )}
        </div>
    );
};

export default Collares;