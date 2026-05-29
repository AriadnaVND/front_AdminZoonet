import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import adminApi from '../api/adminApi'; 
import { User, Mail, Shield, CheckCircle, Fingerprint, AlertTriangle } from 'lucide-react';

const AdminProfile = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 🟢 SOLUCIÓN: Quitamos '/api' del inicio porque adminApi ya lo incluye internamente
        adminApi.get('/admin/auth/profile')
            .then(response => {
                setProfile(response.data);
            })
            .catch(err => {
                console.warn("Fallo inicial con adminApi, ejecutando respaldo directo con axios nativo...", err);
                
                const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
                
                if (token) {
                    axios.get('http://localhost:8081/api/admin/auth/profile', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => {
                        setProfile(response.data);
                    })
                    .catch(fallbackErr => {
                        console.error("Error definitivo al cargar perfil:", fallbackErr);
                        setError("No se pudo conectar con el servicio de autenticación. Verifica tu sesión.");
                    });
                } else {
                    setError("No se encontró una sesión activa de administrador.");
                }
            });
    }, []);

    if (error) return (
        <div className="flex flex-col items-center justify-center h-full mt-20 gap-4 text-center p-6">
            <div className="bg-red-500/10 p-4 rounded-full text-red-500 animate-bounce">
                <AlertTriangle size={48} />
            </div>
            <h2 className="text-xl font-bold text-white">Error de Autenticación</h2>
            <p className="text-gray-400 max-w-md text-sm">{error}</p>
            <button 
                onClick={() => window.location.reload()} 
                className="mt-2 bg-slate-800 hover:bg-slate-700 text-teal-400 border border-slate-700 font-medium px-6 py-2 rounded-xl transition-all text-sm"
            >
                Reintentar Conexión
            </button>
        </div>
    );

    if (!profile) return (
        <div className="flex items-center justify-center h-full mt-32">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                <p className="text-gray-500 text-xs tracking-widest uppercase animate-pulse">Cargando Credenciales...</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto mt-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Encabezado de Perfil */}
            <div className="relative bg-[#1e293b] rounded-3xl p-8 border border-slate-800 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
                
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-2xl shadow-teal-500/20">
                        <User size={64} />
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl font-bold text-white mb-1">{profile.name || "Administrador Zoonet"}</h1>
                        <p className="text-teal-400 font-medium tracking-wide uppercase text-sm mb-4">
                            {profile.role === 'ROLE_ADMIN' ? 'Administrador Maestro' : profile.role || "ADMINISTRADOR"}
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

            {/* Detalles Técnicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-[#1e293b]/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition-colors">
                    <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-6">Información Personal</h3>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-slate-900 p-3 rounded-2xl text-teal-400">
                                <Mail size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Correo Electrónico</p>
                                <p className="text-white font-medium">{profile.email || "Sin correo registrado"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-slate-900 p-3 rounded-2xl text-teal-400">
                                <Fingerprint size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">ID de Usuario</p>
                                <p className="text-white font-mono text-sm">
                                    #{profile.id ? profile.id.toString().padStart(5, '0') : '00001'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1e293b]/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition-colors">
                    <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-6">Estado del Sistema</h3>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${profile.active !== false ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`}></div>
                                <span className="text-sm text-gray-300">Estado de Cuenta</span>
                            </div>
                            <span className={`text-xs font-bold px-3 py-1 rounded-lg ${profile.active !== false ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                {profile.active !== false ? 'ACTIVO' : 'INACTIVO'}
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