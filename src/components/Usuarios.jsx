import React, { useEffect, useState, useMemo } from 'react';
import { userService } from '../api/userService';
import { 
  ShieldAlert, CheckCircle, Users, Crown, 
  Plus, X, Save, Search, Activity, Zap, Eye
} from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterPlan, setFilterPlan] = useState('ALL'); 
    
    const [showModal, setShowModal] = useState(false);
    // NUEVOS ESTADOS PARA LA VISTA DE DETALLES
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewingUser, setViewingUser] = useState(null);

    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', plan: 'BASIC', active: true });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await userService.getAllUsers();
            const cleanData = response.data.map(u => ({
                ...u,
                plan: u.plan ? u.plan.trim().toUpperCase() : 'BASIC'
            }));
            setUsers(cleanData);
        } catch (error) {
            console.error("Error al cargar usuarios", error);
        } finally {
            setLoading(false);
        }
    };

    const stats = useMemo(() => {
        return {
            total: users.length,
            activos: users.filter(u => u.active).length,
            premium: users.filter(u => u.plan === 'PREMIUM').length,
            free: users.filter(u => u.plan !== 'PREMIUM').length,
        };
    }, [users]);

    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value.trim() === "") {
            loadUsers();
        } else {
            try {
                const response = await userService.searchUsers(value);
                setUsers(response.data.map(u => ({ ...u, plan: u.plan.trim().toUpperCase() })));
            } catch (error) {
                console.error("Error en la búsqueda", error);
            }
        }
    };

    const handleStatusChange = async (userId, currentActiveStatus) => {
        try {
            const newStatus = !currentActiveStatus;
            await userService.toggleUserStatus(userId, newStatus);
            setUsers(users.map(u => u.id === userId ? { ...u, active: newStatus } : u));
        } catch {
            alert("Error al actualizar estado");
        }
    };

    const openModal = (user = null) => {
        if (user) {
            setSelectedUser(user);
            setFormData({ name: user.name, email: user.email, password: '', plan: user.plan, active: user.active });
        } else {
            setSelectedUser(null);
            setFormData({ name: '', email: '', password: '', plan: 'BASIC', active: true });
        }
        setShowModal(true);
    };

    // FUNCIÓN PARA ABRIR LA VISTA DE DETALLES
    const openViewModal = (user) => {
        setViewingUser(user);
        setShowViewModal(true);
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();
        try {
            if (selectedUser) {
                await userService.updateUser(selectedUser.id, formData);
            } else {
                await userService.createUser(formData);
            }
            loadUsers();
            setShowModal(false);
        } catch (error) {
            alert("Error al procesar la solicitud");
        }
    };

    if (loading) return <div className="p-20 text-teal-400 font-bold text-center">Cargando Zoonet...</div>;

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500 bg-[#0f172a] min-h-screen text-slate-200">
            
            {/* --- HEADER --- */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Gestión de Usuarios</h1>
                    <p className="text-slate-400 text-xs mt-1">Control de acceso y suscripciones</p>
                </div>
                <div className="bg-[#1e293b] border border-slate-700/50 p-2 px-4 rounded-xl flex items-center gap-3 shadow-lg">
                    <Users className="text-teal-400" size={18} />
                    <div className="leading-tight">
                        <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Total Global</p>
                        <p className="text-lg font-black text-white">{stats.total}</p>
                    </div>
                </div>
            </div>

            {/* --- STATS CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 shadow-sm">
                    <div className="bg-amber-500/10 p-2 rounded-lg w-fit mb-3"><Crown className="text-amber-500" size={20}/></div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Premium</p>
                    <h3 className="text-2xl font-black text-white">{stats.premium}</h3>
                </div>

                <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 shadow-sm">
                    <div className="bg-blue-500/10 p-2 rounded-lg w-fit mb-3"><Zap className="text-blue-500" size={20}/></div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Free</p>
                    <h3 className="text-2xl font-black text-white">{stats.free}</h3>
                </div>

                <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden">
                    <div className="bg-emerald-500/10 p-2 rounded-lg w-fit mb-3"><Activity className="text-emerald-500" size={20}/></div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Activos</p>
                    <h3 className="text-2xl font-black text-white">{stats.activos}</h3>
                    <div className="absolute bottom-0 left-0 w-full bg-emerald-500 h-0.5 opacity-50"></div>
                </div>

                <button 
                    onClick={() => openModal()} 
                    className="bg-[#1e293b]/30 border-2 border-dashed border-teal-500/30 hover:border-teal-500/60 p-5 rounded-2xl flex flex-col justify-center items-center gap-2 transition-all group active:scale-95"
                >
                    <Plus className="text-teal-500 group-hover:scale-110 transition-transform" size={24} />
                    <span className="text-teal-500 font-bold text-xs uppercase tracking-widest">Agregar Usuario</span>
                </button>
            </div>

            {/* --- BARRA DE FILTROS --- */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex bg-[#1e293b] p-1 rounded-xl border border-slate-800">
                    <button onClick={() => setFilterPlan('ALL')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filterPlan === 'ALL' ? 'bg-teal-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Todos</button>
                    <button onClick={() => setFilterPlan('PREMIUM')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filterPlan === 'PREMIUM' ? 'bg-teal-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Premium</button>
                    <button onClick={() => setFilterPlan('FREE')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filterPlan === 'FREE' ? 'bg-teal-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Free</button>
                </div>

                <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-500 transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full bg-[#1e293b] border border-slate-800 text-white pl-10 pr-4 py-2 rounded-xl outline-none focus:border-teal-500 text-sm transition-all"
                    />
                </div>
            </div>

            {/* --- TABLA --- */}
            <div className="bg-[#1e293b] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest bg-slate-800/30">
                            <th className="px-6 py-4">Usuario</th>
                            <th className="px-6 py-4 text-center">Estado</th>
                            <th className="px-6 py-4">Plan</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 text-sm">
                        {users
                            .filter(u => u.role !== 'ROLE_ADMIN')
                            .filter(u => filterPlan === 'ALL' ? true : (filterPlan === 'PREMIUM' ? u.plan === 'PREMIUM' : u.plan !== 'PREMIUM'))
                            .map((user) => (
                            <tr key={user.id} className="hover:bg-slate-800/40 transition-all">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-slate-700 flex items-center justify-center font-bold text-teal-400 text-xs">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-white font-bold">{user.name}</p>
                                            <p className="text-[10px] text-slate-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black border ${user.active ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 'text-rose-400 border-rose-500/20 bg-rose-500/5'}`}>
                                        {user.active ? 'ACTIVO' : 'SUSPENDIDO'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-[10px] font-black tracking-widest ${user.plan === 'PREMIUM' ? 'text-amber-500' : 'text-blue-400'}`}>
                                        {user.plan === 'PREMIUM' ? 'PREMIUM' : 'FREE'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        {/* NUEVO BOTÓN VER */}
                                        <button onClick={() => openViewModal(user)} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-teal-500">
                                            <Eye size={14}/>
                                        </button>
                                        <button onClick={() => openModal(user)} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] font-bold text-blue-400 border border-slate-700 uppercase">Editar</button>
                                        <button onClick={() => handleStatusChange(user.id, user.active)} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700">
                                            {user.active ? <ShieldAlert size={14} className="text-amber-500"/> : <CheckCircle size={14} className="text-emerald-500"/>}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- NUEVO MODAL DE VISTA (SOLO LECTURA) --- */}
            {showViewModal && viewingUser && (
                <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1e293b] border border-slate-700 w-full max-w-sm rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-white">Detalles del Usuario</h2>
                            <button onClick={() => setShowViewModal(false)} className="text-slate-500 hover:text-white transition-colors"><X size={20}/></button>
                        </div>
                        <div className="space-y-6">
                            <div className="flex flex-col items-center gap-2 pb-4 border-b border-slate-800">
                                <div className="h-16 w-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center font-black text-teal-400 text-2xl">
                                    {viewingUser.name.charAt(0)}
                                </div>
                                <div className="text-center">
                                    <p className="text-white font-black text-lg uppercase tracking-tight">{viewingUser.name}</p>
                                    <p className="text-xs text-slate-500">{viewingUser.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">ID Único</p>
                                    <p className="text-white font-mono text-xs">#{viewingUser.id}</p>
                                </div>
                                <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Suscripción</p>
                                    <p className={`text-xs font-black ${viewingUser.plan === 'PREMIUM' ? 'text-amber-500' : 'text-blue-400'}`}>
                                        {viewingUser.plan}
                                    </p>
                                </div>
                                <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 col-span-2">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Estado del Sistema</p>
                                    <div className="flex items-center gap-2">
                                        <div className={`h-2 w-2 rounded-full animate-pulse ${viewingUser.active ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                        <p className={`text-xs font-bold ${viewingUser.active ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {viewingUser.active ? 'OPERATIVO / ACTIVO' : 'SUSPENDIDO / INACTIVO'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => setShowViewModal(false)} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-black py-4 rounded-xl mt-4 transition-all uppercase tracking-widest text-[10px] border border-slate-700">
                                Cerrar Vista
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL EDITAR/REGISTRAR (TU MODAL ORIGINAL) --- */}
            {showModal && (
                <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1e293b] border border-slate-700 w-full max-w-sm rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-white">{selectedUser ? 'Editar Perfil' : 'Nuevo Usuario'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white transition-colors"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleSaveUser} className="space-y-4 text-left">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre</label>
                                <input className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-sm text-white outline-none focus:border-teal-500" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
                                <input className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-sm text-white outline-none focus:border-teal-500" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Plan</label>
                                    <select className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-xs text-white outline-none focus:border-teal-500 font-bold" value={formData.plan} onChange={(e) => setFormData({...formData, plan: e.target.value})}>
                                        <option value="BASIC">FREE</option>
                                        <option value="PREMIUM">PREMIUM</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Clave</label>
                                    <input className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-sm text-white outline-none focus:border-teal-500" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required={!selectedUser} />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-teal-600 hover:bg-teal-500 text-white font-black py-4 rounded-xl mt-4 flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-[10px]">
                                <Save size={16}/> {selectedUser ? 'Actualizar' : 'Registrar'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;