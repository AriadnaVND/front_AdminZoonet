import React, { useEffect, useState, useMemo } from 'react';
import { userService } from '../api/userService';
import {
    Users, Crown, X, Search,
    Mail, Calendar, ChevronDown, Filter,
    CheckCircle, UserX, Heart, TrendingUp
} from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterPlan, setFilterPlan] = useState('ALL');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewingUser, setViewingUser] = useState(null);

    const BACKEND_URL = "https://api.vickari.site";

    useEffect(() => { loadUsers(); }, []);

    useEffect(() => {
        const handleClickOutside = () => setShowStatusDropdown(false);
        if (showStatusDropdown) document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showStatusDropdown]);

    const loadUsers = async () => {
        try {
            const response = await userService.getAllUsers();
            const cleanData = response.data.map(u => ({
                ...u,
                name: u.name || "Usuario sin nombre",
                email: u.email || "Sin correo",
                plan: u.plan ? u.plan.trim().toUpperCase() : 'FREE'
            }));
            setUsers(cleanData);
        } catch (error) {
            console.error("Error al cargar usuarios", error);
        } finally {
            setLoading(false);
        }
    };

    const stats = useMemo(() => ({
        total: users.length,
        activos: users.filter(u => u.active).length,
        premium: users.filter(u => u.plan === 'PREMIUM').length,
        free: users.filter(u => u.plan !== 'PREMIUM').length,
        mascotas: users.filter(u => u.petName && u.petName !== 'Sin registrar').length,
    }), [users]);

    const getPetPhotoUrl = (photoPath) => {
        if (!photoPath) return null;
        if (photoPath.startsWith("http://") || photoPath.startsWith("https://")) return photoPath;
        if (photoPath.startsWith("/")) return `${BACKEND_URL}${photoPath}`;
        return `${BACKEND_URL}/${photoPath}`;
    };

    const handleContactar = (user) => {
        const asunto = encodeURIComponent(
            user.active
                ? `Notificación de suspensión de cuenta - ZooNet`
                : `Reactivación de cuenta - ZooNet`
        );
        const cuerpo = encodeURIComponent(
            user.active
                ? `Estimado/a ${user.name},\n\nLe informamos que su cuenta en la plataforma ZooNet ha sido suspendida temporalmente por nuestro equipo de administración.\n\nSi cree que esto es un error o desea más información, puede responder este correo para comunicarse con nosotros.\n\nAtentamente,\nEquipo ZooNet`
                : `Estimado/a ${user.name},\n\nNos complace informarle que su cuenta en la plataforma ZooNet ha sido reactivada exitosamente.\n\nYa puede acceder con normalidad a todos los servicios de la plataforma.\n\nAtentamente,\nEquipo ZooNet`
        );
        window.open(
            `https://mail.google.com/mail/?view=cm&to=${user.email}&su=${asunto}&body=${cuerpo}`,
            '_blank'
        );
    };

    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value.trim() === "") {
            loadUsers();
        } else {
            try {
                const response = await userService.searchUsers(value);
                setUsers(response.data.map(u => ({
                    ...u,
                    name: u.name || "Usuario sin nombre",
                    email: u.email || "Sin correo",
                    plan: u.plan ? u.plan.trim().toUpperCase() : 'FREE'
                })));
            } catch (error) {
                console.error("Error en la búsqueda", error);
            }
        }
    };

    const handleStatusChange = async (userId, currentActiveStatus) => {
        try {
            const newStatus = !currentActiveStatus;
            await userService.toggleUserStatus(userId, newStatus);
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, active: newStatus } : u));
            if (viewingUser?.id === userId) {
                setViewingUser(prev => ({ ...prev, active: newStatus }));
            }
        } catch {
            alert("Error al actualizar estado");
        }
    };

    const openViewModal = (user) => {
        setViewingUser(user);
        setShowViewModal(true);
    };

    const filteredUsers = users
        .filter(u => u.role !== 'ROLE_ADMIN' && u.role !== 'ADMIN')
        .filter(u => {
            if (filterPlan === 'ALL') return true;
            return filterPlan === 'PREMIUM' ? u.plan === 'PREMIUM' : u.plan !== 'PREMIUM';
        })
        .filter(u => {
            if (filterStatus === 'ALL') return true;
            return filterStatus === 'ACTIVOS' ? u.active : !u.active;
        });

    const statusLabel = filterStatus === 'ALL' ? 'Todos' : filterStatus === 'ACTIVOS' ? 'Activos' : 'Inactivos';

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-[#0f172a]">
            <div className="text-center">
                <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-teal-400 font-bold">Cargando Zoonet...</p>
            </div>
        </div>
    );

    return (
        <div className="p-6 space-y-6 bg-[#0f172a] min-h-screen text-slate-200 animate-in fade-in duration-500">

            {/* HEADER */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Gestión de Usuarios</h1>
                    <p className="text-slate-400 text-xs mt-1">Control de acceso, hardware IoT y suscripciones de la plataforma</p>
                </div>
                <div className="bg-teal-500 p-3 px-5 rounded-xl flex items-center gap-3 shadow-lg shadow-teal-500/20">
                    <Users size={18} className="text-white" />
                    <div className="leading-tight">
                        <p className="text-[9px] text-white/70 uppercase font-black tracking-widest">Total Usuarios</p>
                        <p className="text-lg font-black text-white">{stats.total}</p>
                    </div>
                </div>
            </div>

            {/* TABS PLANES */}
            <div className="flex gap-3">
                <button
                    onClick={() => setFilterPlan(filterPlan === 'PREMIUM' ? 'ALL' : 'PREMIUM')}
                    className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs transition-all uppercase tracking-wide ${
                        filterPlan === 'PREMIUM'
                            ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'
                            : 'bg-[#1e293b] text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                >
                    <Crown size={14} />
                    Premium
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                        filterPlan === 'PREMIUM' ? 'bg-white/20 text-white' : 'bg-[#0f172a] text-teal-400'
                    }`}>
                        {stats.premium}
                    </span>
                </button>
                <button
                    onClick={() => setFilterPlan(filterPlan === 'FREE' ? 'ALL' : 'FREE')}
                    className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs transition-all uppercase tracking-wide ${
                        filterPlan === 'FREE'
                            ? 'bg-slate-700 text-white shadow-lg'
                            : 'bg-[#1e293b] text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                >
                    <Users size={14} />
                    Gratuitos
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                        filterPlan === 'FREE' ? 'bg-white/20 text-white' : 'bg-[#0f172a] text-teal-400'
                    }`}>
                        {stats.free}
                    </span>
                </button>
                {filterPlan !== 'ALL' && (
                    <button
                        onClick={() => setFilterPlan('ALL')}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl text-[10px] font-bold text-slate-500 hover:text-slate-300 border border-dashed border-slate-700 transition-all uppercase tracking-wider"
                    >
                        <X size={12} /> Ver todos
                    </button>
                )}
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                        <div className="bg-teal-500/10 p-2.5 rounded-xl">
                            <Crown className="text-teal-400" size={20} />
                        </div>
                        <span className="bg-teal-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                            {stats.premium}
                        </span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Total Usuarios</p>
                    <h3 className="text-2xl font-black text-white mt-1">{stats.premium}</h3>
                    <p className="text-[10px] text-slate-500 mt-1">Plan Premium</p>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 rounded-l-2xl" />
                </div>

                <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                        <div className="bg-emerald-500/10 p-2.5 rounded-xl">
                            <CheckCircle className="text-emerald-500" size={20} />
                        </div>
                        <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                            {stats.activos}/{stats.total}
                        </span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Activos</p>
                    <h3 className="text-2xl font-black text-white mt-1">{stats.activos}</h3>
                    <div className="mt-3 bg-[#0f172a] rounded-full h-1.5">
                        <div
                            className="bg-emerald-500 h-1.5 rounded-full transition-all"
                            style={{ width: stats.total > 0 ? `${(stats.activos / stats.total) * 100}%` : '0%' }}
                        />
                    </div>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-2xl" />
                </div>

                <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                        <div className="bg-blue-500/10 p-2.5 rounded-xl">
                            <TrendingUp className="text-blue-400" size={20} />
                        </div>
                        <span className="bg-blue-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                            +0
                        </span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Nuevos (30d)</p>
                    <h3 className="text-2xl font-black text-white mt-1">0</h3>
                    <p className="text-[10px] text-emerald-400 font-semibold mt-1">Este mes</p>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-2xl" />
                </div>

                <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                        <div className="bg-purple-500/10 p-2.5 rounded-xl">
                            <Heart className="text-purple-400" size={20} />
                        </div>
                        <span className="bg-slate-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                            {stats.mascotas}
                        </span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Total Mascotas</p>
                    <h3 className="text-2xl font-black text-white mt-1">{stats.mascotas}</h3>
                    <p className="text-[10px] text-slate-500 mt-1">Registradas</p>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 rounded-l-2xl" />
                </div>
            </div>

            {/* TABLA */}
            <div className="bg-[#1e293b] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800/60 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between bg-slate-800/10">
                    <div className="flex items-center gap-2">
                        <Crown className="text-teal-400" size={18} />
                        <h2 className="font-bold text-white text-sm tracking-tight">
                            {filterPlan === 'PREMIUM' ? 'Auditoría Usuarios Premium' : filterPlan === 'FREE' ? 'Auditoría Usuarios Gratuitos' : 'Registros Globales de Clientes'}
                        </h2>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-400 transition-colors" size={15} />
                            <input
                                type="text"
                                placeholder="Buscar por dueño o mascota..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="w-full bg-[#0f172a] border border-slate-800 text-white pl-9 pr-4 py-2 rounded-xl outline-none focus:border-teal-500 text-xs transition-all"
                            />
                        </div>
                        <div className="relative">
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowStatusDropdown(!showStatusDropdown); }}
                                className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] border border-slate-800 rounded-xl text-xs text-slate-300 hover:border-slate-700 transition-all font-bold uppercase tracking-wider"
                            >
                                <Filter size={13} className="text-slate-500" />
                                Estado: {statusLabel}
                                <ChevronDown size={13} className={`text-slate-500 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
                            </button>
                            {showStatusDropdown && (
                                <div className="absolute right-0 top-full mt-2 bg-[#1e293b] border border-slate-800 rounded-xl shadow-2xl z-10 min-w-[140px] overflow-hidden">
                                    {[['ALL', 'Todos'], ['ACTIVOS', 'Activos'], ['INACTIVOS', 'Inactivos']].map(([val, label]) => (
                                        <button
                                            key={val}
                                            onClick={(e) => { e.stopPropagation(); setFilterStatus(val); setShowStatusDropdown(false); }}
                                            className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors flex items-center justify-between ${
                                                filterStatus === val
                                                    ? 'bg-[#0f172a] text-teal-400 font-bold'
                                                    : 'text-slate-400 hover:bg-[#0f172a]/50 hover:text-slate-200'
                                            }`}
                                        >
                                            {label}
                                            {filterStatus === val && <CheckCircle size={13} className="text-teal-400" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="hidden md:grid grid-cols-5 px-6 py-3 bg-slate-800/30 border-b border-slate-800/50 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <div>Usuario Titular</div>
                    <div>Contacto / Credencial</div>
                    <div>Mascota de Soporte & IoT</div>
                    <div>Estado del Sistema</div>
                    <div className="text-right">Fecha Sincronización</div>
                </div>

                <div className="divide-y divide-slate-800/40">
                    {filteredUsers.length === 0 ? (
                        <div className="px-6 py-12 text-center text-slate-500">
                            <Users size={32} className="mx-auto mb-2 opacity-20" />
                            <p className="text-sm">No se encontraron usuarios</p>
                        </div>
                    ) : (
                        filteredUsers.map((user) => (
                            <div key={user.id} className="grid grid-cols-1 md:grid-cols-5 px-6 py-4 items-center hover:bg-slate-800/30 transition-all gap-4 md:gap-0">

                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black text-sm shadow-md border ${
                                            user.plan === 'PREMIUM'
                                                ? 'bg-teal-500/10 border-teal-500 text-teal-400'
                                                : 'bg-slate-800 border-slate-700 text-slate-400'
                                        }`}>
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        {user.plan === 'PREMIUM' && (
                                            <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-lg p-0.5 shadow-md">
                                                <Crown size={8} className="text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm tracking-tight">{user.name}</p>
                                        <p className="text-slate-500 text-[10px] font-mono">UID: #{user.id}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-slate-300 text-xs flex items-center gap-1.5 truncate max-w-[180px]">
                                        <Mail size={11} className="text-slate-500 flex-shrink-0" />
                                        {user.email}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    {user.petPhoto ? (
                                        <img
                                            src={getPetPhotoUrl(user.petPhoto)}
                                            alt={user.petName}
                                            className="h-9 w-9 rounded-xl object-cover border border-slate-700 shadow-inner"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div
                                        className="h-9 w-9 rounded-xl bg-[#0f172a] items-center justify-center text-slate-600 border border-slate-800"
                                        style={{ display: user.petPhoto ? 'none' : 'flex' }}
                                    >
                                        <Heart size={13} />
                                    </div>
                                    <div>
                                        <p className="text-slate-200 font-bold text-xs uppercase tracking-tight truncate max-w-[120px]">
                                            {user.petName || 'Sin registrar'}
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate max-w-[140px]">
                                            {user.deviceSerialNumber || 'Hardware inactivo'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleStatusChange(user.id, user.active)}
                                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                                            user.active ? 'bg-teal-500' : 'bg-slate-700 border border-slate-600'
                                        }`}
                                    >
                                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-md transition-transform ${
                                            user.active ? 'translate-x-4' : 'translate-x-0.5'
                                        }`} />
                                    </button>
                                    <span className={`text-[10px] font-black tracking-wider uppercase ${
                                        user.active ? 'text-emerald-400' : 'text-rose-400'
                                    }`}>
                                        {user.active ? 'Activo' : 'Suspendido'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-4 border-t border-slate-800/40 pt-3 md:pt-0 md:border-none">
                                    <div className="text-left md:text-right font-mono text-[10px] text-slate-500 flex items-center gap-1">
                                        <Calendar size={11} />
                                        {user.createdAt
                                            ? new Date(user.createdAt).toLocaleDateString('es-PE', { day: 'numeric', month: 'numeric', year: 'numeric' })
                                            : '—'}
                                    </div>
                                    <button
                                        onClick={() => openViewModal(user)}
                                        className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-400 font-bold text-[10px] rounded-lg transition-all border border-slate-700 uppercase tracking-wider shadow-sm"
                                    >
                                        Ver Perfil
                                    </button>
                                </div>

                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* MODAL */}
            {showViewModal && viewingUser && (
                <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1e293b] border border-slate-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-slate-200">

                        <div className="flex justify-between items-center mb-5">
                            <div className="flex items-center gap-2">
                                <Users size={18} className="text-teal-400" />
                                <div>
                                    <h2 className="font-black text-white text-md uppercase tracking-tight">Auditoría de Perfil</h2>
                                    <p className="text-[10px] text-slate-500">Ficha de lectura interna de cuenta</p>
                                </div>
                            </div>
                            <button onClick={() => setShowViewModal(false)} className="text-slate-500 hover:text-white transition-colors p-1">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="bg-[#0f172a] rounded-2xl p-4 flex items-center gap-4 border border-slate-800/60 mb-4">
                            <div className="relative">
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-black text-lg shadow-md border ${
                                    viewingUser.plan === 'PREMIUM'
                                        ? 'bg-teal-500/10 border-teal-500 text-teal-400'
                                        : 'bg-slate-800 border-slate-700 text-slate-400'
                                }`}>
                                    {viewingUser.name.charAt(0).toUpperCase()}
                                </div>
                                {viewingUser.plan === 'PREMIUM' && (
                                    <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-lg p-1 shadow">
                                        <Crown size={8} className="text-white" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="font-black text-white text-md tracking-tight uppercase">{viewingUser.name}</p>
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider mt-1 ${
                                    viewingUser.plan === 'PREMIUM'
                                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                }`}>
                                    {viewingUser.plan === 'PREMIUM' && <Crown size={9} />}
                                    Suscripción {viewingUser.plan === 'PREMIUM' ? 'Premium' : 'Free'}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-5">
                            <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800/50 col-span-2">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Identificación Digital (Email)</p>
                                <p className="text-xs text-slate-200 font-medium truncate flex items-center gap-1.5">
                                    <Mail size={11} className="text-slate-500" />
                                    {viewingUser.email}
                                </p>
                            </div>

                            <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800/50 col-span-2">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Soporte IoT & Mascota</p>
                                <div className="flex items-center gap-2">
                                    {viewingUser.petPhoto && (
                                        <img
                                            src={getPetPhotoUrl(viewingUser.petPhoto)}
                                            alt=""
                                            className="h-6 w-6 rounded-md object-cover border border-slate-700"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    )}
                                    <p className="text-xs text-slate-300 font-bold uppercase tracking-tight">
                                        {viewingUser.petName || 'Ninguna'}
                                    </p>
                                </div>
                                <p className="text-[10px] text-slate-500 font-mono mt-1">
                                    {viewingUser.deviceSerialNumber || 'Hardware no vinculado'}
                                </p>
                            </div>

                            <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800/50">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Código Único</p>
                                <p className="text-white font-mono text-xs">#{viewingUser.id}</p>
                            </div>

                            <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800/50">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Estado de Acceso</p>
                                <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider mt-0.5 ${
                                    viewingUser.active
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}>
                                    {viewingUser.active ? 'Operativo' : 'Inactivo'}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleContactar(viewingUser)}
                                className="flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-black py-3 rounded-xl transition-all text-[10px] uppercase tracking-wider shadow-md shadow-teal-500/10"
                            >
                                <Mail size={13} />
                                Contactar
                            </button>
                            <button
                                onClick={() => handleStatusChange(viewingUser.id, viewingUser.active)}
                                className={`flex items-center justify-center gap-2 font-black py-3 rounded-xl transition-all text-[10px] uppercase tracking-wider border ${
                                    viewingUser.active
                                        ? 'border-slate-700 bg-slate-800 text-amber-500 hover:bg-rose-950/20 hover:text-rose-400 hover:border-rose-900/40'
                                        : 'border-slate-700 bg-slate-800 text-emerald-400 hover:bg-emerald-950/20'
                                }`}
                            >
                                <UserX size={13} />
                                {viewingUser.active ? 'Suspender' : 'Activar'}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;