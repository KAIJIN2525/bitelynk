"use client";

import { useState, useEffect } from "react";
import { FiEye, FiCheck, FiX, FiClock, FiSearch } from "react-icons/fi";
import Card from "./Card";
import LoadingSpinner from "./LoadingSpinner";
import { orderService } from "../lib/services/orderService";
import { statusStyles, iconMap } from "../assets/dummyadmin";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch orders from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await orderService.fetchAllOrders();
        // Map backend data to match the structure expected by Orders.jsx
        const ordersArray = (res.orders || []).map((order) => ({
          id: order.id || order._id,
          customerName:
            order.customer?.name ||
            order.firstName + " " + order.lastName ||
            "N/A",
          customerEmail: order.customer?.email || order.email || "",
          items: order.items
            ? order.items.map((i) => i.product?.name || i.name || "")
            : [],
          total: order.total,
          status: order.orderStatus || order.status,
          createdAt: order.createdAt,
          paymentStatus: order.paymentStatus,
        }));
        setOrders(ordersArray);
      } catch (error) {
        // Optionally show a toast or error
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Helper to get status style and icon
  const getStatusStyle = (status) => {
    const normalizedStatus = status?.toLowerCase();
    return statusStyles[normalizedStatus] || statusStyles.pending;
  };

  const filteredOrders = orders.filter((order) => {
    const customerName = order.customerName || order.name || "";
    const matchesSearch =
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.id?.toString() || order._id?.toString() || "").includes(
        searchTerm
      );
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">
            Manage customer orders and track status
          </p>
        </div>
      </div>

      <Card
        title="All Orders"
        subtitle={`${filteredOrders.length} orders found`}
      >
        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Items
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Total
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const statusStyle = getStatusStyle(order.status);
                  return (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4 font-medium text-gray-900">
                        #{order.id}
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="flex items-center gap-2">
                            {/* Optionally add an icon here if desired */}
                            <span className="font-medium truncate">
                              {order.customerName}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.customerEmail}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-600">
                          {order.items.join(", ")}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-900">
                        ₦{order.total?.toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-3 py-1 text-sm rounded-full ${statusStyle.bg} ${statusStyle.color}`}
                        >
                          {iconMap[statusStyle.icon]}
                          <span className="capitalize">
                            {statusStyle.label || order.status}
                          </span>
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {order.status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleStatusUpdate(order.id, "completed")
                                }
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Mark as Completed"
                              >
                                <FiCheck className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusUpdate(order.id, "cancelled")
                                }
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Cancel Order"
                              >
                                <FiX className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Orders;
