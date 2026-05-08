import React, { useState, useEffect } from 'react';
import { 
    Brain, Activity, Target, Cpu, CheckCircle, 
    Zap, Clock, ShieldCheck, Database, Check, X, AlertTriangle, Lock
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer 
} from 'recharts';

const performanceData = [
    { time: '00:00', precision: 98.2 }, { time: '04:00', precision: 98.5 },
    { time: '08:00', precision: 98.7 }, { time: '12:00', precision: 98.9 },
    { time: '16:00', precision: 98.6 }, { time: '20:00', precision: 98.8 },
];

const IAControl = () => {
    // 1. Cargamos los estados iniciales desde localStorage para que persistan
    const [threshold, setThreshold] = useState(() => {
        return localStorage.getItem('ia_threshold') || 85;
    });
    const [lastSavedThreshold, setLastSeenThreshold] = useState(() => {
        return localStorage.getItem('ia_threshold');
    });
    const [isLocked, setIsLocked] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // 2. Efecto para comprobar el bloqueo al cargar el componente
    useEffect(() => {
        const lockUntil = localStorage.getItem('ia_lock_until');
        if (lockUntil) {
            const now = new Date().getTime();
            if (now < parseInt(lockUntil)) {
                setIsLocked(true);
            } else {
                // Si el tiempo ya pasó, liberamos el bloqueo automáticamente
                localStorage.removeItem('ia_lock_until');
                setIsLocked(false);
            }
        }
    }, []);

    const handleApplyChanges = () => {
        if (threshold === lastSavedThreshold) {
            alert("El porcentaje es el mismo al actual. Seleccione uno diferente para recalibrar.");
            return;
        }

        // Lógica de éxito y persistencia
        const now = new Date();
        // Simulamos bloqueo de 7 días: now.getTime() + (7 * 24 * 60 * 60 * 1000)
        // Para probarlo rápido, puedes poner 1 minuto: now.getTime() + (60 * 1000)
        const lockTime = now.getTime() + (7 * 24 * 60 * 60 * 1000); 

        localStorage.setItem('ia_threshold', threshold);
        localStorage.setItem('ia_lock_until', lockTime);

        setLastSeenThreshold(threshold);
        setShowToast(true);
        setIsLocked(true);
        
        setTimeout(() => setShowToast(false), 4000);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10 relative">
            
            {/* NOTIFICACIÓN GRANDE Y VISIBLE */}
            {showToast && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-[#1e293b] border-2 border-teal-500 p-10 rounded-[40px] shadow-[0_0_50px_rgba(45,212,191,0.2)] text-center max-w-sm mx-4 transform animate-in zoom-in duration-300">
                        <div className="bg-teal-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-500/40">
                            <Check size={40} className="text-white" strokeWidth={4} />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2 text-center">¡CAMBIO EXITOSO!</h2>
                        <p className="text-slate-400 text-sm mb-6 text-center">
                            El umbral de Google AI se ha fijado en <span className="text-teal-400 font-bold">{threshold}%</span>. 
                            El sistema ha entrado en periodo de prueba requerido.
                        </p>
                        <button 
                            onClick={() => setShowToast(false)}
                            className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-2xl font-bold text-xs transition-all border border-slate-700 w-full"
                        >
                            ENTENDIDO
                        </button>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <div className="flex justify-between items-start text-left">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Brain className="text-teal-400" size={32} /> Control de Inteligencia Artificial
                    </h1>
                    <p className="text-slate-400 mt-1">Configuración del motor de reconocimiento facial (Google AI API)</p>
                </div>
                {isLocked && (
                    <div className="bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-2xl flex items-center gap-2 text-orange-400 animate-pulse">
                        <Clock size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-left">Periodo de prueba activo</span>
                    </div>
                )}
            </div>

            {/* CARDS SUPERIORES */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <IACard title="Estado del Sistema" value="Operativo" sub="Uptime: 99.9%" color="text-green-400" icon={<CheckCircle/>} badge="100%" />
                <IACard title="Precisión Global" value="98.7%" sub="Media semanal" color="text-teal-400" icon={<Target/>} badge="Óptimo" />
                <IACard title="Matches Hoy" value="4" sub="+1 vs ayer" color="text-orange-400" icon={<Zap/>} badge="Activo" />
                <IACard title="Tiempo Respuesta" value="1.0 min" sub="Latencia de API" color="text-blue-400" icon={<Clock/>} badge="Normal" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* CONTROL DE UMBRAL */}
                <div className={`bg-[#1e293b] p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6 relative transition-all ${isLocked ? 'opacity-70' : ''}`}>
                    
                    {isLocked && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0f172a]/40 backdrop-blur-[2px] rounded-3xl p-6 text-center">
                            <div className="bg-orange-500/20 p-4 rounded-full mb-4 border border-orange-500/30">
                                <Lock className="text-orange-500" size={32} />
                            </div>
                            <h4 className="text-white font-bold mb-1">Ajuste Modificado Recientemente</h4>
                            <p className="text-slate-400 text-xs leading-relaxed max-w-[250px]">
                                Para garantizar la estabilidad de los matches, debe esperar el tiempo requerido (7 días) para volver a calibrar.
                            </p>
                        </div>
                    )}

                    <div className="flex justify-between items-end text-left">
                        <div>
                            <h3 className="text-white font-bold text-lg">Umbral de Similitud</h3>
                            <p className="text-slate-400 text-sm">Ajuste de sensibilidad para matches</p>
                        </div>
                        <div className="text-right">
                            <span className="text-3xl font-black text-white">{threshold}%</span>
                            <p className="text-teal-400 text-[10px] font-bold uppercase tracking-widest text-right">Nivel Actual</p>
                        </div>
                    </div>

                    <input 
                        type="range" min="50" max="100" value={threshold} 
                        disabled={isLocked}
                        onChange={(e) => setThreshold(parseInt(e.target.value))}
                        className={`w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500 ${isLocked ? 'cursor-not-allowed' : ''}`}
                    />
                    
                    <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
                        <span>50% - Sensible</span>
                        <span>100% - Estricto</span>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl flex gap-3 text-left">
                        <ShieldCheck className="text-blue-400 shrink-0" size={20} />
                        <p className="text-xs text-slate-300 leading-relaxed">
                            <strong className="text-white font-black">REGLA DE SEGURIDAD:</strong> La recalibración de la IA requiere un periodo mínimo de 1 semana para comparar resultados históricos.
                        </p>
                    </div>

                    <button 
                        disabled={isLocked || threshold === lastSavedThreshold}
                        onClick={handleApplyChanges}
                        className={`w-full font-black py-4 rounded-2xl transition-all shadow-lg uppercase tracking-widest text-xs ${
                            isLocked 
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                            : 'bg-teal-500 hover:bg-teal-600 text-white shadow-teal-500/20'
                        }`}
                    >
                        {isLocked ? 'BLOQUEADO POR PRUEBA' : 'Aplicar Configuración'}
                    </button>
                </div>

                {/* INFO DE BASE DE DATOS */}
                <div className="bg-[#1e293b] p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
                    <h3 className="text-white font-bold text-lg mb-4 text-left">Estado del Dataset</h3>
                    <DBMetric label="Imágenes Analizadas" value="1,248" icon={<Database className="text-teal-400"/>} />
                    <DBMetric label="Modelos Activos" value="Gemini-Pro-Vision" icon={<Cpu className="text-purple-400"/>} />
                    <DBMetric label="Sincronización" value="En tiempo real" icon={<Clock className="text-blue-400"/>} />
                    
                    <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-start gap-3 text-left">
                        <AlertTriangle size={18} className="text-orange-500 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-slate-400">
                            Cualquier cambio en el umbral afecta la precisión de búsqueda de las mascotas en tiempo real. Use con precaución.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const IACard = ({ title, value, sub, color, icon, badge }) => (
    <div className="bg-[#1e293b] p-5 rounded-3xl border border-slate-800 relative overflow-hidden transition-all hover:border-slate-700">
        <div className="flex justify-between items-start mb-4 text-left">
            <div className={`p-3 rounded-2xl bg-slate-800 ${color} border border-slate-700`}>
                {React.cloneElement(icon, { size: 22 })}
            </div>
            <span className="text-[9px] font-black px-2 py-0.5 rounded-lg bg-slate-900 text-teal-400 border border-slate-700 uppercase tracking-tighter">
                {badge}
            </span>
        </div>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider text-left">{title}</p>
        <h2 className="text-2xl font-black text-white mt-1 text-left">{value}</h2>
        <p className="text-[10px] text-slate-400 mt-1 text-left">{sub}</p>
    </div>
);

const DBMetric = ({ label, value, icon }) => (
    <div className="flex items-center justify-between p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
        <div className="flex items-center gap-4 text-left">
            <div className="p-2 bg-slate-900 rounded-xl">{icon}</div>
            <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider text-left">{label}</p>
                <p className="text-white font-bold text-sm text-left">{value}</p>
            </div>
        </div>
        <CheckCircle className="text-teal-500/20" size={18} />
    </div>
);

export default IAControl;