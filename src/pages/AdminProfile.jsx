import React, { useEffect, useState } from 'react';
import { userService } from '../api/userService';
import { User, Mail, Shield, CheckCircle, Fingerprint } from 'lucide-react';

const AdminProfile = () => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        userService.getAdminProfile()
            .then(data => setProfile(data))
            .catch(err => console.error("Error al cargar perfil", err));
    }, []);

    if (!profile) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto mt-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Encabezado de Perfil */}
            <div className="relative bg-[#1e293b] rounded-3xl p-8 border border-slate-800 shadow-2xl overflow-hidden">
                {/* Decoración de fondo */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
                
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    {/* Avatar (Solo visualización) */}
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-2xl shadow-teal-500/20">
                        <User size={64} />
                    </div>

                    {/* Información Principal */}
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl font-bold text-white mb-1">{profile.name}</h1>
                        <p className="text-teal-400 font-medium tracking-wide uppercase text-sm mb-4">
                            {profile.role === 'ROLE_ADMIN' ? 'Administrador Maestro' : profile.role}
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            <span className="flex items-center gap-2 bg-slate-900/50 border border-slate-700 px-4 py-2 rounded-xl text-xs text-gray-300">
                                <CheckCircle size={14} className="text-emerald-500" />
                                Cuenta Verificada
                            </span>
                            <span className="flex items-center gap-2 bg-slate-900/50 border border-slate-700 px-4 py-2 rounded-xl text-xs text-gray-300">
                                <Shield size={14} className="text-teal-500" />
                                Acceso Total
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detalles Técnicos en Cuadrícula */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {/* Tarjeta de Información Personal */}
                <div className="bg-[#1e293b]/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition-colors">
                    <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-6">Información Personal</h3>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-slate-900 p-3 rounded-2xl text-teal-400">
                                <Mail size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Correo Electrónico</p>
                                <p className="text-white font-medium">{profile.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-slate-900 p-3 rounded-2xl text-teal-400">
                                <Fingerprint size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">ID de Usuario</p>
                                <p className="text-white font-mono text-sm">#{profile.id.toString().padStart(5, '0')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tarjeta de Seguridad y Estado */}
                <div className="bg-[#1e293b]/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition-colors">
                    <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-6">Estado del Sistema</h3>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${profile.active ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`}></div>
                                <span className="text-sm text-gray-300">Estado de Cuenta</span>
                            </div>
                            <span className={`text-xs font-bold px-3 py-1 rounded-lg ${profile.active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                {profile.active ? 'ACTIVO' : 'INACTIVO'}
                            </span>
                        </div>
                        
                        <div className="bg-teal-500/5 border border-teal-500/20 p-4 rounded-2xl">
                            <p className="text-[11px] text-teal-500 font-bold uppercase mb-1">Nota de Seguridad</p>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Tu cuenta tiene privilegios de nivel superior. Todas las acciones realizadas están siendo auditadas por el sistema de seguridad de Zoonet.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;