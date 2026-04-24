import { useEffect, useState } from 'react';
import api from '../api/axios';
import { PawPrint, Heart, AlertTriangle, Users, Star, BellRing, Clock } from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#2dd4bf', '#f87171', '#94a3b8'];

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        // 1. Verificación de seguridad: ROLE_ADMIN debe coincidir con el Backend
        if (!token || role !== 'ROLE_ADMIN') {
            window.location.href = '/login';
            return;
        }

        // 2. CORRECCIÓN DE RUTA: Se cambia '/admin/stats' por la ruta real del Backend
        api.get('/admin/dashboard/summary')
            .then(res => {
                setStats(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error al traer stats:", err);
                // Si el error es 401 o 403, el interceptor en axios.js manejará la salida
            });
    }, []);
    
    if (loading) return <div className="p-10 text-white">Cargando panel...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        Bienvenido Administrador 👋
                    </h1>
                    <p className="text-gray-500 mt-1">Resumen del sistema en tiempo real</p>
                </div>

                <div className="bg-gradient-to-r from-teal-500 to-teal-700 p-4 rounded-2xl flex items-center gap-4 shadow-lg shadow-teal-900/20">
                    <Star className="text-white fill-white" size={24} />
                    <div>
                        <p className="text-xs text-teal-100 uppercase font-bold">Tasa de Éxito</p>
                        <p className="text-2xl font-black text-white">
                            {/* Usamos datos del DashboardDTO del backend */}
                            {stats?.successRate ? `${stats.successRate}%` : "87.3%"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<PawPrint size={20} />}
                    label="Mascotas Registradas"
                    value={stats?.totalPets || "0"} // Mapeo de DashboardDTO
                    change="+12.5%"
                    color="bg-teal-500/10"
                    iconColor="text-teal-400"
                />
                <StatCard
                    icon={<Heart size={20} />}
                    label="Premium Activos"
                    value={stats?.activePremium || "0"} // Mapeo de DashboardDTO
                    change="+8.2%"
                    color="bg-red-500/10"
                    iconColor="text-red-400"
                />
                <StatCard
                    icon={<AlertTriangle size={20} />}
                    label="Tickets Pendientes"
                    value={stats?.pendingTickets || "0"} // Mapeo de DashboardDTO
                    change="-5.3%"
                    color="bg-orange-500/10"
                    iconColor="text-orange-400"
                />
                <StatCard
                    icon={<Users size={20} />}
                    label="Usuarios Totales"
                    value={stats?.totalUsers || "0"} // Mapeo de DashboardDTO
                    change="+15.7%"
                    color="bg-green-500/10"
                    iconColor="text-green-400"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
                <div className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 bg-teal-400 rounded-full"></span>
                        Reportes por Distrito
                    </h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.reportsByDistrict || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                                <Bar dataKey="reportes" fill="#2dd4bf" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                        Estatus de Dispositivos
                    </h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats?.devicesStatus ? Object.entries(stats.devicesStatus).map(([name, value]) => ({ name, value })) : []}
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {COLORS.map((color, index) => <Cell key={index} fill={color} />)}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-[#1e293b] p-6 rounded-3xl border border-slate-800">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-white font-bold flex items-center gap-2">
                            <Clock className="text-teal-400" size={20} />
                            Actividad Semanal
                        </h3>
                        <span className="text-xs text-gray-500 bg-slate-800 px-3 py-1 rounded-full">Últimos 7 días</span>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[
                                { day: 'Lun', valor: 400 }, { day: 'Mar', valor: 300 },
                                { day: 'Mié', valor: 600 }, { day: 'Jue', valor: 800 },
                                { day: 'Vie', valor: 500 }, { day: 'Sáb', valor: 900 },
                                { day: 'Dom', valor: 700 }
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="valor"
                                    stroke="#2dd4bf"
                                    strokeWidth={4}
                                    dot={{ r: 6, fill: '#2dd4bf' }}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AlertItem = ({ title, time, desc, type }) => {
    const colors = {
        danger: "bg-red-500/20 text-red-400",
        warning: "bg-orange-500/20 text-orange-400",
        info: "bg-blue-500/20 text-blue-400"
    };

    return (
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex flex-col gap-1">
            <div className="flex justify-between items-center">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${colors[type]}`}>
                    {type}
                </span>
                <span className="text-[10px] text-gray-500 font-medium">{time}</span>
            </div>
            <h4 className="text-white text-sm font-bold mt-1">{title}</h4>
            <p className="text-gray-500 text-xs">{desc}</p>
        </div>
    );
};

const StatCard = ({ icon, label, value, change, color, iconColor }) => (
    <div className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800 transition-all hover:border-teal-500/30">
        <div className="flex justify-between items-start mb-4">
            <div className={`${color} ${iconColor} p-3 rounded-2xl`}>{icon}</div>
            <span className="text-xs font-bold px-2 py-1 rounded-lg bg-slate-800 text-teal-400">{change}</span>
        </div>
        <p className="text-gray-400 text-sm font-medium">{label}</p>
        <h3 className="text-white text-3xl font-bold mt-1">{value}</h3>
    </div>
);

export default Dashboard;