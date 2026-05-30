import { useState } from 'react'; 
import {
    LayoutDashboard, Users, CreditCard, MessageSquare,
    Radio, FileText, Headphones, LogOut, PawPrint, AlertCircle
} from 'lucide-react'; // Se eliminó BrainCircuit
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Estado para controlar el Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Se eliminó la opción de IA de este arreglo
    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
        { icon: <Users size={20} />, label: 'Usuarios', path: '/usuarios' },
        { icon: <CreditCard size={20} />, label: 'Pagos', path: '/pagos' },
        { icon: <MessageSquare size={20} />, label: 'Comunidad', path: '/comunidad' },
        { icon: <Radio size={20} />, label: 'Collares', path: '/collares' },
        { icon: <FileText size={20} />, label: 'Reportes', path: '/reportes' },
        { icon: <Headphones size={20} />, label: 'Soporte', path: '/soporte' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login', { replace: true });
    };

    return (
        <>
            <div className="w-64 bg-[#1e293b] h-screen flex flex-col text-gray-400 border-r border-slate-800">
                {/* Logo */}
                <div className="p-6 flex items-center gap-3">
                    <div className="bg-[#2dd4bf] p-2 rounded-lg">
                        <PawPrint size={24} color="white" />
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-xl leading-tight">Zoonet</h1>
                        <p className="text-[10px] uppercase tracking-widest text-gray-500">Panel Admin</p>
                    </div>
                </div>

                {/* Navegación */}
                <nav className="flex-1 px-4 py-4 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                location.pathname === item.path
                                    ? 'bg-[#2dd4bf] text-white shadow-lg shadow-teal-900/20'
                                    : 'hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            {item.icon}
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Footer Sidebar */}
                <div className="p-4 border-t border-slate-800">
                    <button 
                        onClick={() => setIsModalOpen(true)} 
                        className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-red-400 transition-colors group"
                    >
                        <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
                        <span className="font-medium">Cerrar Sesión</span>
                    </button>
                </div>
            </div>

            {/* MODAL DE CONFIRMACIÓN */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all flex flex-col items-center text-center">
                        
                        {/* Icono de Advertencia */}
                        <div className="bg-red-50 p-4 rounded-full mb-4">
                            <AlertCircle size={40} className="text-red-500" />
                        </div>

                        <h2 className="text-xl font-bold text-gray-800 mb-2">¿Cerrar Sesión?</h2>
                        <p className="text-gray-500 mb-8">
                            Estás a punto de salir del Panel de Administración de Zoonet. ¿Seguro que quieres continuar?
                        </p>

                        <div className="flex flex-col w-full gap-3">
                            <button 
                                onClick={handleLogout}
                                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors"
                            >
                                Sí, cerrar sesión
                            </button>
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;