import { useState } from 'react';
import { Mail, Lock, PawPrint } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role);
            navigate('/dashboard');
        } catch (err) {
            setError("Usuario o contraseña incorrectos");
        }
    };

    // Estilo base para todos los inputs
    const inputStyle = "w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all bg-gray-50 text-gray-700";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e293b] via-[#0f766e] to-[#0d9488]">
            <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col items-center">

                {/* Logo */}
                <div className="bg-[#2dd4bf] p-4 rounded-2xl mb-6 shadow-lg shadow-teal-100 flex items-center justify-center">
                    <PawPrint size={48} color="white" strokeWidth={2.5} />
                </div>

                <h1 className="text-gray-500 text-xl font-medium mb-8">Panel de Administración</h1>

                <form onSubmit={handleLogin} className="w-full space-y-5">
                    {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg">{error}</p>}

                    {/* Campo Email */}
                    <div className="space-y-2">
                        <label className="text-gray-700 font-semibold ml-1 text-sm">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@zoonet.com"
                                className={inputStyle}
                                required
                            />
                        </div>
                    </div>

                    {/* Campo Contraseña */}
                    <div className="space-y-2">
                        <label className="text-gray-700 font-semibold ml-1 text-sm">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="********"
                                className={inputStyle}
                                required
                            />
                        </div>
                    </div>

                    {/* Botón Iniciar Sesión */}
                    <button type="submit" className="w-full bg-[#2dd4bf] hover:bg-[#25bca8] text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-[0.98] mt-4">
                        Iniciar Sesión
                    </button>
                </form>

                <p className="mt-8 text-sm text-gray-400">
                    ¿No tienes cuenta? <Link to="/register" className="text-[#2dd4bf] font-semibold hover:underline">Registrarse</Link>
                </p>

            </div>
        </div>
    );
};

export default Login;