import api from "../api";

export const orderService = {
    fetchAllOrders: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return await api.get(`/orders/admin/all?${queryString}`);
    },
    updateOrderStatus: async (orderId, status) => {
        return await api.put(`/orders/admin/${orderId}/status`, status);
    }
}