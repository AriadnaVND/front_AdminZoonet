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
            localStorage.setItem('token', response.data.token); // Guarda el JWT
            localStorage.setItem('role', response.data.role); // Guarda el rol del usuario
            navigate('/dashboard');
        } catch (err) {
            setError("Usuario o contraseña incorrectos");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e293b] via-[#0f766e] to-[#0d9488]">
            <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col items-center">

                {/* Logo / Icono de Huella */}
                <div className="bg-[#2dd4bf] p-4 rounded-2xl mb-6 shadow-lg shadow-teal-100 flex items-center justify-center">
                    <PawPrint size={48} color="white" strokeWidth={2.5} />
                </div>

                <h1 className="text-gray-500 text-xl font-medium mb-8">Panel de Administración</h1>

                <form onSubmit={handleLogin} className="w-full space-y-5">
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    {/* Campo Email */}
                    <div className="space-y-2">
                        <label className="text-gray-700 font-semibold ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="email"
                                value={email} // 3. Vincular valor
                                onChange={(e) => setEmail(e.target.value)} // 3. Capturar cambio
                                placeholder="Tu email"
                                className="..."
                            />
                        </div>
                    </div>

                    {/* Campo Contraseña */}
                    <div className="space-y-2">
                        <label className="text-gray-700 font-semibold ml-1">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="password"
                                value={password} // 3. Vincular valor
                                onChange={(e) => setPassword(e.target.value)} // 3. Capturar cambio
                                placeholder="********"
                                className="..."
                            />
                        </div>
                    </div>

                    {/* Botón Iniciar Sesión */}
                    <button type="submit" className="w-full bg-[#2dd4bf] hover:bg-[#25bca8] text-white font-bold py-3 rounded-xl transition-colors shadow-md mt-4">
                        Iniciar Sesión
                    </button>
                </form>

                <p className="mt-8 text-gray-400">
                    ¿No tienes cuenta? <Link to="/register" className="text-[#2dd4bf] font-semibold hover:underline">Registrarse</Link>
                </p>

            </div>
        </div>
    );
};

export default Login;