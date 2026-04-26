import React, { useEffect, useState } from 'react';
import { getUsers, updateUserStatus } from '../api/userService';
import { Trash2, ShieldAlert, CheckCircle } from 'lucide-react'; // Iconos sugeridos

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
        if (window.confirm(`¿Estás seguro de cambiar el estado a ${newStatus}?`)) {
            try {
                await updateUserStatus(userId, newStatus);
                // Actualizar la lista localmente para no recargar todo
                setUsers(users.map(user =>
                    user.id === userId ? { ...user, status: newStatus } : user
                ));
            } catch (error) {
                alert("Error al actualizar el estado");
            }
        }
    };

    if (loading) return <div className="p-6">Cargando usuarios...</div>;

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestión de Usuarios</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex space-x-3">
                                    {user.status === 'ACTIVE' ? (
                                        <button
                                            onClick={() => handleStatusChange(user.id, 'BANNED')}
                                            className="text-yellow-600 hover:text-yellow-900"
                                            title="Banear Usuario"
                                        >
                                            <ShieldAlert size={20} />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleStatusChange(user.id, 'ACTIVE')}
                                            className="text-green-600 hover:text-green-900"
                                            title="Activar Usuario"
                                        >
                                            <CheckCircle size={20} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleStatusChange(user.id, 'DELETED')}
                                        className="text-red-600 hover:text-red-900"
                                        title="Borrado Lógico"
                                    >
                                        <Trash2 size={20} />
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