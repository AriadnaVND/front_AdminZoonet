import { useEffect, useState } from 'react';
import { getDashboardStats } from '../api/dashboardService';
import { 
    PawPrint, Heart, AlertTriangle, Users, Star, 
    Clock, CheckCircle2, Zap, ShieldAlert, ChevronRight, X 
} from 'lucide-react';
import { 
    PieChart, Pie, Cell, Tooltip, 
    ResponsiveContainer, XAxis, YAxis, AreaChart, Area, CartesianGrid 
} from 'recharts';

const COLORS = ['#2dd4bf', '#f87171', '#fbbf24'];

// Datos simplificados: Máximo 3-4 registros por día para evitar saturación
const trafficData = [
    { d: 'Lun', reportes: 2, reencuentros: 1, usuarios: 4 },
    { d: 'Mar', reportes: 3, reencuentros: 2, usuarios: 3 },
    { d: 'Mié', reportes: 1, reencuentros: 1, usuarios: 4 },
    { d: 'Jue', reportes: 4, reencuentros: 3, usuarios: 4 },
    { d: 'Vie', reportes: 2, reencuentros: 2, usuarios: 3 },
    { d: 'Sáb', reportes: 3, reencuentros: 4, usuarios: 4 },
    { d: 'Dom', reportes: 2, reencuentros: 3, usuarios: 3 },
];

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activePremium: 0,
        totalPets: 0,
        pendingTickets: 0,
        successRate: 94.8,
        devicesStatus: {} 
    });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Error al sincronizar dashboard:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-10 text-teal-400 font-bold animate-pulse">Sincronizando datos de Zoonet...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative bg-[#0f172a] p-6 min-h-screen">
            
            {/* ENCABEZADO CON COLOR CORREGIDO (VERDE ESMERALDA) */}
            <div className="flex justify-between items-end text-left">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Dashboard</h1>
                    <p className="text-slate-500 font-medium">Bienvenido Administrador 👋 Resumen de hoy</p>
                </div>
                <div className="bg-[#1e293b] border border-slate-800 p-4 rounded-3xl flex items-center gap-4 shadow-xl">
                    {/* El color de fondo y sombra ahora coincide con tu primera imagen */}
                    <div className="bg-[#00cba9] p-2.5 rounded-xl text-white shadow-lg shadow-[#00cba9]/30">
                        <Star size={20} fill="white"/>
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] text-[#00cba9] uppercase font-black tracking-widest">Success Rate</p>
                        <p className="text-2xl font-black text-white">{stats.successRate}%</p>
                    </div>
                </div>
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<PawPrint fill="currentColor"/>} label="Mascotas" value={stats.totalPets} trend="+12.5%" color="from-teal-500/20 to-teal-500/5" border="border-teal-500/20" iconColor="text-teal-400" bgColor="bg-teal-400/10" />
                <StatCard icon={<Heart fill="currentColor"/>} label="Premium" value={stats.activePremium} trend="+8.2%" color="from-rose-500/20 to-rose-500/5" border="border-rose-500/20" iconColor="text-rose-400" bgColor="bg-rose-400/10" />
                <StatCard icon={<AlertTriangle fill="currentColor"/>} label="Tickets" value={stats.pendingTickets} trend="-2" color="from-orange-500/20 to-orange-500/5" border="border-orange-500/20" iconColor="text-orange-400" bgColor="bg-orange-400/10" />
                <StatCard icon={<Users fill="currentColor"/>} label="Usuarios" value={stats.totalUsers} trend="+15%" color="from-blue-500/20 to-blue-500/5" border="border-blue-500/20" iconColor="text-blue-400" bgColor="bg-blue-400/10" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* TRÁFICO (DATOS MODERADOS) */}
                <div className="bg-[#1e293b] p-8 rounded-[2rem] border border-slate-800 shadow-xl">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-white font-bold text-left flex items-center gap-2">
                            <Zap className="text-yellow-400" size={18} fill="currentColor" /> Actividad Semanal
                        </h3>
                        <div className="flex gap-3 text-[9px] font-black uppercase tracking-tighter">
                            <span className="flex items-center gap-1 text-teal-400"><div className="w-1.5 h-1.5 rounded-full bg-teal-400"/> Reportes</span>
                            <span className="flex items-center gap-1 text-rose-400"><div className="w-1.5 h-1.5 rounded-full bg-rose-400"/> Reencuentros</span>
                            <span className="flex items-center gap-1 text-orange-400"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"/> Usuarios</span>
                        </div>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trafficData}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorReunion" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f87171" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.5}/>
                                <XAxis dataKey="d" axisLine={false} tickLine={false} stroke="#64748b" dy={10} fontSize={12} />
                                <YAxis axisLine={false} tickLine={false} stroke="#64748b" domain={[0, 15]} fontSize={12} />
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#ffffff', border: 'none', borderRadius: '12px', color: '#1e293b'}}
                                    itemStyle={{fontSize: '12px', fontWeight: 'bold'}}
                                />
                                <Area type="monotone" dataKey="usuarios" stackId="1" stroke="#fbbf24" strokeWidth={3} fill="url(#colorUsers)" />
                                <Area type="monotone" dataKey="reportes" stackId="1" stroke="#2dd4bf" strokeWidth={3} fill="url(#colorReports)" />
                                <Area type="monotone" dataKey="reencuentros" stackId="1" stroke="#f87171" strokeWidth={3} fill="url(#colorReunion)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ESTADO COLLARES */}
                <div className="bg-[#1e293b] p-8 rounded-[2rem] border border-slate-800 shadow-xl">
                    <h3 className="text-white font-bold mb-8 text-left flex items-center gap-2">
                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(236,72,153,0.8)]"></div> Collares IoT
                    </h3>
                    <div className="h-72 w-full flex flex-col md:flex-row items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={Object.entries(stats.devicesStatus || {}).map(([name, value]) => ({ name, value }))}
                                    innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value"
                                >
                                    {Object.entries(stats.devicesStatus || {}).map((e, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '15px', color: '#fff'}} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="w-full md:w-48 space-y-3">
                            {Object.entries(stats.devicesStatus || {}).map(([name, value], i) => (
                                <div key={i} className="flex justify-between items-center text-[11px]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                                        <span className="text-slate-400">{name}</span>
                                    </div>
                                    <span className="font-bold text-white">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* SECCIÓN ALERTAS */}
            <div className="bg-[#1e293b] p-8 rounded-[2rem] border border-slate-800 shadow-xl pb-10">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <ShieldAlert className="text-orange-400" size={20} /> Alertas Rápidas
                    </h3>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="text-teal-400 text-[10px] font-black uppercase tracking-widest hover:text-teal-300 transition-colors flex items-center gap-1"
                    >
                        Ver todas <ChevronRight size={14}/>
                    </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <AlertItem icon={<Clock className="text-orange-400" />} title="IA en mantenimiento" desc="Actualización de reconocimiento facial a las 3 AM" tag="Medio" tagColor="bg-orange-500/20 text-orange-400" iconBg="bg-orange-500/10" />
                    <AlertItem icon={<CheckCircle2 className="text-blue-400" />} title="Pago pendiente" desc="Suscripción premium de Usuario #1234 vence pronto" tag="Bajo" tagColor="bg-blue-500/20 text-blue-400" iconBg="bg-blue-500/10" />
                </div>
            </div>

            <AlertasModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
};

// Componentes internos (StatCard, AlertItem, AlertasModal) omitidos por brevedad pero mantienen la lógica del verde corregido.
const StatCard = ({ icon, label, value, trend, color, border, iconColor, bgColor }) => (
    <div className={`bg-gradient-to-br ${color} ${border} border p-7 rounded-[2rem] transition-all hover:scale-[1.02] flex flex-col items-start relative overflow-hidden group`}>
        <div className="flex justify-between w-full items-start mb-4">
            <div className={`${iconColor} ${bgColor} p-3 rounded-2xl`}>{icon}</div>
            <span className="text-[10px] font-black bg-white/10 px-2 py-1 rounded-lg text-white/70">{trend}</span>
        </div>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{label}</p>
        <h3 className="text-white text-4xl font-black mt-2 tracking-tighter">{value.toLocaleString()}</h3>
    </div>
);

const AlertItem = ({ icon, title, desc, tag, tagColor, iconBg }) => (
    <div className="flex items-center justify-between p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-all">
        <div className="flex items-center gap-4">
            <div className={`p-3 ${iconBg} rounded-2xl`}>{icon}</div>
            <div className="text-left">
                <h4 className="text-white font-bold text-sm">{title}</h4>
                <p className="text-slate-500 text-xs">{desc}</p>
            </div>
        </div>
        <span className={`px-4 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${tagColor}`}>{tag}</span>
    </div>
);

const AlertasModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-[#1e293b] border border-slate-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl">
                <div className="p-8 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-white text-xl font-black">Historial de Alertas</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-white p-2 rounded-full"><X size={24}/></button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-orange-400/10 text-orange-400"><Clock size={18}/></div>
                            <div className="text-left"><h4 className="text-white font-bold text-sm">IA Mantenimiento</h4><p className="text-slate-500 text-xs">Actualización exitosa</p></div>
                        </div>
                        <span className="text-[10px] font-black uppercase text-orange-400">Medio</span>
                    </div>
                </div>
                <div className="p-6 flex justify-center border-t border-slate-800">
                    <button onClick={onClose} className="bg-[#00cba9] hover:bg-[#00b093] text-white font-black py-3 px-10 rounded-2xl transition-all shadow-lg shadow-[#00cba9]/20">Cerrar</button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;