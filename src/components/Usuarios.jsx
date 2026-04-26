import React, { useEffect, useState } from 'react';
import { getUsers, updateUserStatus } from '../api/userService';
import { Trash2, ShieldAlert, CheckCircle, Users, Crown, TrendingUp } from 'lucide-react'; // Iconos sugeridos

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await getUsers();
            setUsers(response.data);
        } catch (error) {
            console.error("Error al cargar usuarios", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (userId, newStatus) => {
        try {
            await updateUserStatus(userId, newStatus);

            setUsers(users.map(user =>
                user.id === userId ? { ...user, active: newStatus } : user
            ));
        } catch {
            alert("Error al actualizar");
        }
    };

    const activeUsers = users.filter(u => u.active).length;

    if (loading) return <div className="p-6">Cargando usuarios...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
                    <p className="text-slate-400">Administra los usuarios registrados</p>
                </div>

                <div className="bg-slate-700 px-4 py-2 rounded-xl flex items-center gap-2">
                    <Users size={18} />
                    <span>Total: {users.length}</span>
                </div>
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

                <div className="bg-slate-700 p-5 rounded-2xl shadow-lg">
                    <div className="flex justify-between">
                        <Crown className="text-yellow-400" />
                        <span>{users.length}</span>
                    </div>
                    <p className="text-slate-400 mt-3">Total Usuarios</p>
                </div>

                <div className="bg-slate-700 p-5 rounded-2xl shadow-lg">
                    <div className="flex justify-between">
                        <CheckCircle className="text-green-400" />
                        <span>{activeUsers}/{users.length}</span>
                    </div>
                    <p className="text-slate-400 mt-3">Activos</p>
                </div>

                <div className="bg-slate-700 p-5 rounded-2xl shadow-lg">
                    <div className="flex justify-between">
                        <TrendingUp className="text-blue-400" />
                        <span>+0</span>
                    </div>
                    <p className="text-slate-400 mt-3">Nuevos (30d)</p>
                </div>

                <div className="bg-slate-700 p-5 rounded-2xl shadow-lg">
                    <div className="flex justify-between">
                        <Users className="text-cyan-400" />
                        <span>{users.length}</span>
                    </div>
                    <p className="text-slate-400 mt-3">Total Mascotas</p>
                </div>

            </div>

            {/* TABLA */}
            <div className="bg-slate-800 rounded-2xl p-6 shadow-lg">

                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold">Usuarios</h2>

                    <input
                        placeholder="Buscar usuario..."
                        className="bg-slate-700 px-4 py-2 rounded-lg outline-none"
                    />
                </div>

                <table className="w-full">
                    <thead>
                        <tr className="text-slate-400 text-left">
                            <th className="py-3">Usuario</th>
                            <th>Email</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-t border-slate-700 hover:bg-slate-700/40">

                                <td className="py-3">{user.name}</td>
                                <td>{user.email}</td>

                                <td>
                                    <span className={`px-3 py-1 rounded-full text-xs ${user.active
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        {user.active ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>

                                <td className="flex gap-3 py-3">

                                    {user.active ? (
                                        <button onClick={() => handleStatusChange(user.id, false)}>
                                            <ShieldAlert className="text-yellow-400 hover:scale-110" />
                                        </button>
                                    ) : (
                                        <button onClick={() => handleStatusChange(user.id, true)}>
                                            <CheckCircle className="text-green-400 hover:scale-110" />
                                        </button>
                                    )}

                                    <button onClick={() => handleStatusChange(user.id, false)}>
                                        <Trash2 className="text-red-400 hover:scale-110" />
                                    </button>

                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

        </div>
    );
};

export default UserManagement;