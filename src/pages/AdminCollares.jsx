import React, { useState } from 'react';
import Collares from '../components/Collares'; 
import { Wifi, AlertCircle, ClipboardList, CheckCircle2 } from 'lucide-react';

const AdminCollaresPage = () => {
    // Estado para las estadísticas calculadas desde la BD
    const [stats, setStats] = useState({ total: 0, active: 0, lowBattery: 0, offline: 0 });

    // Función que recibe la data real de la tabla y actualiza los cuadros superiores
    const updateStats = (devices) => {
        setStats({
            total: devices.length,
            active: devices.filter(d => d.status === 'CONNECTED').length,
            // Asumiendo que tu objeto tiene batteryLevel, si no, usa el placeholder de la tabla
            lowBattery: devices.filter(d => d.status === 'CONNECTED' && (d.batteryLevel < 20)).length, 
            offline: devices.filter(d => d.status !== 'CONNECTED').length
        });
    };

    return (
        <div className="p-6 space-y-8 bg-[#0f172a] min-h-screen text-slate-200">
            
            {/* ENCABEZADO */}
            <div className="mb-2">
                <h1 className="text-3xl font-bold text-white tracking-tight">Gestión de Collares</h1>
                <p className="text-slate-400 text-sm mt-1">Administra y monitorea el estado de los dispositivos GPS en tiempo real</p>
            </div>

            {/* --- CUADROS GRANDES DINÁMICOS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <BigStatCard 
                    label="REPORTES ACTIVOS" 
                    value={stats.total} 
                    icon={<ClipboardList className="text-teal-400" size={24} />}
                    iconBg="bg-teal-500/10"
                />
                <BigStatCard 
                    label="CONECTADOS" 
                    value={stats.active} 
                    icon={<Wifi className="text-emerald-400" size={24} />}
                    iconBg="bg-emerald-500/10"
                />
                <BigStatCard 
                    label="BATERÍA BAJA" 
                    value={stats.lowBattery} 
                    icon={<AlertCircle className="text-rose-400" size={24} />}
                    iconBg="bg-rose-500/10"
                />
                <BigStatCard 
                    label="RESOLVIDOS / OFFLINE" 
                    value={stats.offline} 
                    icon={<CheckCircle2 className="text-blue-400" size={24} />}
                    iconBg="bg-blue-500/10"
                />
            </div>

            {/* TABLA DE DISPOSITIVOS */}
            <div className="animate-in slide-in-from-bottom-4 duration-500">
                <Collares onDataLoad={updateStats} />
            </div>

        </div>
    );
};

// Componente para los cuadros grandes
const BigStatCard = ({ label, value, icon, iconBg }) => (
    <div className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800 flex justify-between items-center shadow-lg hover:border-slate-700 transition-all">
        <div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">
                {label}
            </p>
            <h3 className="text-4xl font-bold text-white">{value}</h3>
        </div>
        <div className={`${iconBg} p-4 rounded-2xl`}>
            {icon}
        </div>
    </div>
);

export default AdminCollaresPage;