import {
    LayoutDashboard, Users, CreditCard, MessageSquare,
    BrainCircuit, Radio, FileText, Headphones, LogOut, PawPrint
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
        { icon: <Users size={20} />, label: 'Usuarios', path: '/usuarios' },
        { icon: <CreditCard size={20} />, label: 'Pagos', path: '/pagos' },
        { icon: <MessageSquare size={20} />, label: 'Comunidad', path: '/comunidad' },
        { icon: <BrainCircuit size={20} />, label: 'IA', path: '/ia' },
        { icon: <Radio size={20} />, label: 'Collares', path: '/collares' },
        { icon: <FileText size={20} />, label: 'Reportes', path: '/reportes' },
        { icon: <Headphones size={20} />, label: 'Soporte', path: '/soporte' },
    ];

    return (
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
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === item.path
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
                <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-red-400 transition-colors">
                    <LogOut size={20} />
                    <span className="font-medium">Cerrar Sesión</span>
                </button>
                <div className="mt-4 text-[10px] text-center text-gray-600">
                    v1.0.0 • © 2025 Zoonet
                </div>
            </div>
        </div>
    );
};

export default Sidebar;