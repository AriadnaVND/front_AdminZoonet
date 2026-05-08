import React, { useEffect, useState } from 'react';
import { getAllDevices } from '../api/deviceService';
import { Battery, Signal, MapPin, Search } from 'lucide-react';

const Collares = () => {
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        const fetchDevices = async () => {
            const res = await getAllDevices();
            setDevices(res.data);
        };
        fetchDevices();
    }, []);

    return (
        <div className="bg-[#1e293b] rounded-3xl p-8 border border-slate-800 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-white">Gestión de Collares Inteligentes</h2>
                <div className="bg-slate-900/50 border border-slate-700 px-4 py-2 rounded-xl flex items-center gap-2">
                    <Search size={18} className="text-slate-500" />
                    <input placeholder="Buscar ID..." className="bg-transparent outline-none text-sm" />
                </div>
            </div>

            <table className="w-full text-left">
                <thead>
                    <tr className="text-slate-500 text-xs uppercase font-bold">
                        <th className="pb-4">ID Collar</th>
                        <th className="pb-4">Mascota / Dueño</th>
                        <th className="pb-4">Batería</th>
                        <th className="pb-4">Señal</th>
                        <th className="pb-4 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {devices.map((dev) => (
                        <tr key={dev.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-5 font-mono text-teal-400">CLR-00{dev.id}</td>
                            <td className="py-5">
                                <p className="text-white font-bold">{dev.name}</p>
                                <p className="text-xs text-slate-500">{dev.species}</p>
                            </td>
                            <td className="py-5">
                                <div className="flex items-center gap-2">
                                    <Battery size={16} className="text-green-400" />
                                    <span className="text-sm">-- %</span> 
                                </div>
                            </td>
                            <td className="py-5">
                                <Signal size={16} className="text-teal-400" />
                            </td>
                            <td className="py-5 text-center">
                                <button className="bg-teal-500/10 text-teal-400 p-2 rounded-lg hover:bg-teal-500/20">
                                    <MapPin size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Collares;