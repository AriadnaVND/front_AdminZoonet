import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Trash2, ShieldAlert, CheckCircle, Users, Crown, TrendingUp, Phone, Mail } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            // Este endpoint debe llamar a userRepository.findAllUsersSummary() en el Backend
            const response = await api.get('/admin/users/all');
            setUsers(response.data);
        } catch (error) {
            console.error("Error al cargar usuarios de Zoonet", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (userId, currentActiveStatus) => {
        try {
            // Enviamos el opuesto del estado actual
            const newStatus = !currentActiveStatus;
            await api.put(`/admin/users/${userId}/status`, { active: newStatus });

            // Actualizamos el estado localmente para reflejar el cambio en la tabla
            setUsers(users.map(user =>
                user.id === userId ? { ...user, active: newStatus } : user
            ));
        } catch {
            alert("No se pudo actualizar el estado del usuario");
        }
    };

    // FILTRADO: Excluimos al Administrador y aplicamos búsqueda
    const filteredUsers = users.filter(user =>
        user.rol !== 'ADMIN' && // Usamos el campo 'rol' que agregamos al DTO
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const premiumUsers = users.filter(u => u.plan === 'PREMIUM' && u.rol !== 'ADMIN');
    // Ajuste: Ahora usamos el campo 'active' (booleano) que viene de la BD
    const activeUsersCount = users.filter(u => u.active && u.rol !== 'ADMIN').length;

    if (loading) return (
        <div className="flex items-center justify-center p-20 text-teal-400 font-bold">
            <TrendingUp className="animate-bounce mr-2" />
            Cargando base de datos de usuarios de Railway...
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* HEADER */}
            <div className="flex justify-between items-center text-left">
                <div>
                    <h1 className="text-3xl font-bold text-white">Gestión de Usuarios</h1>
                    <p className="text-slate-400">Control de suscriptores y estados de cuenta</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 px-4 py-2 rounded-2xl flex items-center gap-2 text-teal-400">
                    <Users size={18} />
                    <span className="font-bold text-sm tracking-tight">Total Clientes: {filteredUsers.length}</span>
                </div>
            </div>

            {/* CARDS ESTADÍSTICAS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Usuarios Premium" value={premiumUsers.length} icon={<Crown className="text-yellow-400" />} color="bg-yellow-500/10" />
                <StatCard title="Cuentas Activas" value={activeUsersCount} icon={<CheckCircle className="text-green-400" />} color="bg-green-500/10" />
                <StatCard title="Nuevos este mes" value="+12" icon={<TrendingUp className="text-blue-400" />} color="bg-blue-500/10" />
                <StatCard
                    title="Total Mascotas"
                    value={filteredUsers.reduce((acc, u) => acc + (u.petsCount || 0), 0)}
                    icon={<Users className="text-teal-400" />}
                    color="bg-teal-500/10"
                />
            </div>

            {/* TABLA DE USUARIOS */}
            <div className="bg-[#1e293b] rounded-3xl p-8 border border-slate-800 shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 text-left">
                    <h2 className="text-xl font-bold text-white">Listado de Usuarios en el Sistema</h2>
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Buscar por nombre o correo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 text-white px-5 py-3 rounded-2xl outline-none focus:border-teal-500 transition-all text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-500 text-[11px] uppercase tracking-widest font-black border-b border-slate-800">
                                <th className="pb-4">Usuario / Contacto</th>
                                <th className="pb-4">Mascotas</th>
                                <th className="pb-4">Estado</th>
                                <th className="pb-4">Plan</th>
                                <th className="pb-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="group hover:bg-slate-800/30 transition-colors">
                                    <td className="py-5">
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold text-base leading-tight">{user.name}</span>
                                            <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                                                <span className="flex items-center gap-1"><Mail size={10} /> {user.email}</span>
                                                <span className="flex items-center gap-1 font-mono tracking-tighter"><Phone size={10} /> {user.phone || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-slate-900 border border-slate-700 text-teal-400 px-3 py-1 rounded-lg text-xs font-black">
                                                {user.petsCount}
                                            </span>
                                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Animales</span>
                                        </div>
                                    </td>
                                    <td className="py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                            user.active
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                                            }`}>
                                            {user.active ? 'Activo' : 'Suspendido'}
                                        </span>
                                    </td>
                                    <td className="py-5">
                                        <span className={`font-black text-xs tracking-widest ${user.plan === 'PREMIUM' ? 'text-yellow-500' : 'text-slate-500'}`}>
                                            {user.plan}
                                        </span>
                                    </td>
                                    <td className="py-5">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                title={user.active ? "Suspender Usuario" : "Activar Usuario"}
                                                onClick={() => handleStatusChange(user.id, user.active)}
                                                className="p-2.5 rounded-xl hover:bg-slate-700 transition-all text-slate-400"
                                            >
                                                {user.active
                                                    ? <ShieldAlert className="text-yellow-500/70 hover:text-yellow-500" size={18} />
                                                    : <CheckCircle className="text-green-500/70 hover:text-green-500" size={18} />
                                                }
                                            </button>
                                            <button className="p-2.5 rounded-xl hover:bg-red-500/10 transition-all text-slate-400 hover:text-red-400">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Componente auxiliar para las cards de estadísticas
const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-[#1e293b] p-5 rounded-3xl border border-slate-800 shadow-xl transition-all hover:border-slate-700">
        <div className="flex justify-between items-start text-left">
            <div className={`${color} p-3 rounded-2xl`}>{icon}</div>
            <span className="text-2xl font-black text-white">{value}</span>
        </div>
        <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mt-4 text-left">{title}</p>
    </div>
);

export default UserManagement;