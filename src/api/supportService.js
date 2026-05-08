import axios from './axios';

export const getAllTickets = async () => {
    return await axios.get('/admin/support/tickets');
};

export const updateTicketStatus = async (id, status) => {
    // Esto conecta con el método updateStatus de tu AdminSupportController.java
    return await axios.put(`/admin/support/tickets/${id}/status`, { status });
};