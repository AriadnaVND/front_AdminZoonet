import { Mail, Lock, User, PawPrint } from 'lucide-react';
import { Link } from 'react-router-dom';

const Register = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e293b] via-[#0f766e] to-[#0d9488]">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md flex flex-col items-center">

                {/* Logo / Icono de Huella */}
                <div className="bg-[#2dd4bf] p-4 rounded-2xl mb-4 shadow-lg shadow-teal-100 flex items-center justify-center">
                    <PawPrint size={40} color="white" strokeWidth={2.5} />
                </div>

                <h1 className="text-gray-500 text-lg font-medium mb-6 text-center">Zoonet - Panel de Administración</h1>

                <form className="w-full space-y-4">
                    {/* Nombre Completo */}
                    <div className="space-y-1">
                        <label className="text-gray-700 font-semibold text-sm ml-1">Nombre Completo</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Juan Pérez"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all bg-gray-50 text-sm"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <label className="text-gray-700 font-semibold text-sm ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="email"
                                placeholder="admin@zoonet.com"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all bg-gray-50 text-sm"
                            />
                        </div>
                    </div>

                    {/* Contraseña */}
                    <div className="space-y-1">
                        <label className="text-gray-700 font-semibold text-sm ml-1">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="password"
                                placeholder="********"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all bg-gray-50 text-sm"
                            />
                        </div>
                        <p className="text-[10px] text-gray-400 ml-1">Mínimo 6 caracteres</p>
                    </div>

                    {/* Confirmar Contraseña */}
                    <div className="space-y-1">
                        <label className="text-gray-700 font-semibold text-sm ml-1">Confirmar Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="password"
                                placeholder="********"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all bg-gray-50 text-sm"
                            />
                        </div>
                    </div>

                    {/* Botón Crear Cuenta */}
                    <button className="w-full bg-[#2dd4bf] hover:bg-[#25bca8] text-white font-bold py-3 rounded-xl transition-colors shadow-md mt-4">
                        Crear Cuenta
                    </button>
                </form>

                <p className="mt-6 text-sm text-gray-400">
                    ¿Ya tienes cuenta? <Link to="/login" className="text-[#2dd4bf] font-semibold hover:underline">Iniciar Sesión</Link>
                </p>

            </div>
        </div>
    );
};

export default Register;