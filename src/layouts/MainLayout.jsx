import Sidebar from '../components/Sidebar';
import { Outlet, Link } from 'react-router-dom';
import { User } from 'lucide-react';

const MainLayout = () => {
    return (
        <div className="flex h-screen bg-[#0f172a] overflow-hidden text-slate-200">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar con fondo diferenciado y borde inferior sutil */}
                <header className="h-20 flex items-center justify-end px-8 bg-[#0f172a]/50 backdrop-blur-md border-b border-slate-800/50 text-white z-10">
                    
                    <div className="flex items-center gap-6">
                        {/* ENLACE AL PERFIL */}
                        <Link 
                            to="/admin-profile" 
                            className="flex items-center gap-3 pl-6 border-l border-slate-800 cursor-pointer hover:opacity-80 transition-all group"
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold group-hover:text-teal-400 transition-colors">Admin</p>
                                <p className="text-[10px] text-gray-500">Superusuario</p>
                            </div>
                            <div className="bg-[#1e293b] p-2 rounded-full group-hover:bg-teal-500/20 group-hover:ring-2 group-hover:ring-teal-500/50 transition-all">
                                <User size={20} className="text-teal-400" />
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Contenido de la página */}
                <main className="flex-1 overflow-y-auto p-8 bg-[#0f172a]">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;