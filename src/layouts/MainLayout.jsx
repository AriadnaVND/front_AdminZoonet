import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import { Search, Bell, Moon, User } from 'lucide-react';

const MainLayout = () => {
    return (
        <div className="flex h-screen bg-[#0f172a] overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar */}
                <header className="h-20 flex items-center justify-between px-8 text-white">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar usuarios, reportes, mascotas..."
                            className="w-full bg-[#1e293b] border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative cursor-pointer">
                            <Bell size={20} className="text-gray-400" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] w-4 h-4 flex items-center justify-center rounded-full">12</span>
                        </div>
                        <Moon size={20} className="text-gray-400 cursor-pointer" />
                        <div className="flex items-center gap-3 pl-6 border-l border-slate-800 cursor-pointer">
                            <div className="text-right">
                                <p className="text-sm font-bold">Admin</p>
                                <p className="text-[10px] text-gray-500">Superusuario</p>
                            </div>
                            <div className="bg-[#1e293b] p-2 rounded-full">
                                <User size={20} className="text-teal-400" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Contenido de la página */}
                <main className="flex-1 overflow-y-auto p-8 pt-2">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;