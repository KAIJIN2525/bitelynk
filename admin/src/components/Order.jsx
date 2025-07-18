import React, { useEffect, useState } from "react";
import {
  layoutClasses,
  tableClasses,
  statusStyles,
  paymentMethodDetails,
  iconMap,
} from "../assets/dummyadmin";
import { apiServices } from "../lib/services";
import { toast } from "sonner";
import { FiLoader, FiUser } from "react-icons/fi";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiServices.orders.fetchAllOrders();
        console.log("Full API response:", response); // Debug log
        if (response.success) {
          // Ensure orders is always an array
          const ordersArray = Array.isArray(response.orders)
            ? response.orders
            : [];
          setOrders(ordersArray);
        } else {
          setError(response.message || "Failed to fetch orders");
          toast.error(response.message || "Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Error fetching orders");
        toast.error("Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      console.log("Updating order:", orderId, "to status:", newStatus); // Debug log
      const response = await apiServices.orders.updateOrderStatus(orderId, {
        status: newStatus,
      });
      console.log("Update response:", response); // Debug log

      if (response.success) {
        // Update the specific order in the state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, orderStatus: newStatus } : order
          )
        );
        toast.success("Order status updated successfully");
      } else {
        toast.error(response.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Error updating order status");
    }
  };

  const formatPrice = (price) => {
    return `₦${price.toLocaleString()}`;
  };

  const getStatusStyle = (status) => {
    const normalizedStatus = status?.toLowerCase();
    return statusStyles[normalizedStatus] || statusStyles.pending;
  };

  const getPaymentStyle = (paymentMethod) => {
    const method = paymentMethod?.toLowerCase();
    if (method === "cash on delivery" || method === "cod") {
      return paymentMethodDetails.cod;
    } else if (method === "paystack" || method === "card") {
      return paymentMethodDetails.card;
    } else {
      return paymentMethodDetails.default;
    }
  };

  if (loading) {
    return (
      <div className={layoutClasses.page}>
        <div className="mx-auto max-w-7xl">
          <div className={layoutClasses.card}>
            <div className="flex items-center justify-center h-64">
              <FiLoader className="animate-spin text-2xl text-amber-500" />
              <span className="ml-2 text-amber-100">Loading orders...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={layoutClasses.page}>
        <div className="mx-auto max-w-7xl">
          <div className={layoutClasses.card}>
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-red-400">Error: {error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={layoutClasses.page}>
      <div className="mx-auto max-w-7xl">
        <div className={layoutClasses.card}>
          <h2 className={layoutClasses.heading}>Order Management</h2>
          {!Array.isArray(orders) || orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-amber-100/60 text-lg">
                {!Array.isArray(orders)
                  ? "Invalid data format"
                  : "No orders found"}
              </div>
              <div className="text-amber-100/40 text-sm mt-2">
                Orders will appear here once customers place them.
              </div>
            </div>
          ) : (
            <div className={tableClasses.wrapper}>
              <table className={tableClasses.table}>
                <thead className={tableClasses.headerRow}>
                  <tr>
                    {[
                      "Order ID",
                      "Customer",
                      "Address",
                      "Items",
                      "Total Items",
                      "Price",
                      "Payment",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className={
                          tableClasses.headerCell +
                          (h === "Total Items" ? " text-center" : "")
                        }
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const statusStyle = getStatusStyle(order.orderStatus);
                    const paymentStyle = getPaymentStyle(order.paymentMethod);

                    return (
                      <tr key={order.id} className={tableClasses.row}>
                        <td
                          className={`${tableClasses.cellBase} font-medium text-amber-100 font-mono`}
                        >
                          #{order.id.slice(-8)}
                        </td>
                        <td
                          className={`${tableClasses.cellBase} text-amber-100`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <FiUser className="text-amber-400" />
                              <div className="font-medium truncate">
                                {order.customer?.name || "N/A"}
                              </div>
                            </div>
                            <div className="text-sm text-amber-100/60">
                              {order.customer?.email || ""}
                            </div>
                          </div>
                        </td>
                        <td
                          className={`${tableClasses.cellBase} text-amber-100/80`}
                        >
                          <div className="max-w-xs">
                            <div className="truncate">
                              {order.shippingAddress?.address || "N/A"}
                            </div>
                            <div className="text-sm text-amber-100/60">
                              {order.shippingAddress?.city},{" "}
                              {order.shippingAddress?.state}
                            </div>
                          </div>
                        </td>
                        <td
                          className={`${tableClasses.cellBase} text-amber-100/80`}
                        >
                          <div className="max-w-xs">
                            {order.items?.slice(0, 2).map((item, index) => (
                              <div key={index} className="text-sm">
                                {item.name} x{item.quantity}
                              </div>
                            ))}
                            {order.items?.length > 2 && (
                              <div className="text-sm text-amber-100/60">
                                +{order.items.length - 2} more
                              </div>
                            )}
                          </div>
                        </td>
                        <td
                          className={`${tableClasses.cellBase} text-center text-amber-300 font-medium`}
                        >
                          {order.items?.reduce(
                            (total, item) => total + item.quantity,
                            0
                          ) || 0}
                        </td>
                        <td
                          className={`${tableClasses.cellBase} text-amber-300 font-medium`}
                        >
                          {formatPrice(order.total || 0)}
                        </td>
                        <td className={`${tableClasses.cellBase}`}>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border truncate ${paymentStyle.class}`}
                          >
                            {paymentStyle.label}
                          </span>
                        </td>
                        <td className={`${tableClasses.cellBase}`}>
                          <div
                            className={`flex items-center space-x-2 px-3 py-1 rounded-full ${statusStyle.bg}`}
                          >
                            <span className={statusStyle.color}>
                              {iconMap[statusStyle.icon]}
                            </span>
                            <span
                              className={`text-xs font-medium ${statusStyle.color}`}
                            >
                              {statusStyle.label}
                            </span>
                          </div>
                        </td>
                        <td className={`${tableClasses.cellBase}`}>
                          <div className="relative">
                            <select
                              value={order.orderStatus || "pending"}
                              onChange={(e) =>
                                handleUpdateStatus(order.id, e.target.value)
                              }
                              className="px-3 py-1 bg-[#3a2b2b]/50 border border-amber-500/20 rounded-lg text-sm text-amber-100 focus:outline-none focus:border-amber-400 hover:border-amber-300 transition-colors cursor-pointer appearance-none pr-8"
                            >
                              {Object.values(statusStyles).map((status) => (
                                <option
                                  key={status.value}
                                  value={status.value}
                                  className="bg-[#3a2b2b] text-amber-100 hover:bg-[#4a3b3b]"
                                >
                                  {status.label}
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                              <svg
                                className="w-4 h-4 text-amber-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
