import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { CreditCard, CheckCircle } from 'lucide-react';

const PagosAdmin = () => {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        // Endpoint de AdminPaymentController
        api.get('/admin/payments/all')
            .then(res => setPayments(res.data))
            .catch(err => console.error("Error en pagos:", err));
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Control de Pagos (Suscripciones)</h1>
            <div className="bg-[#1e293b] rounded-3xl border border-slate-800 p-8 shadow-2xl">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-slate-500 text-xs uppercase font-bold">
                            <th className="pb-4">ID Transacción</th>
                            <th className="pb-4">Usuario</th>
                            <th className="pb-4">Monto</th>
                            <th className="pb-4">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {payments.map(p => (
                            <tr key={p.id} className="hover:bg-slate-800/30 transition-colors text-white">
                                <td className="py-5 text-slate-400">#PAY-00{p.id}</td>
                                <td className="py-5 font-medium">{p.userEmail}</td>
                                <td className="py-5 text-teal-400 font-bold">S/ {p.amount}</td>
                                <td className="py-5">
                                    <div className="flex items-center gap-2 text-green-400 text-xs font-bold">
                                        <CheckCircle size={14}/> COMPLETADO
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PagosAdmin;