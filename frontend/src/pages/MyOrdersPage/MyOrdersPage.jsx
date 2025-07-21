import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiCalendar,
  FiEye,
  FiArrowLeft,
} from "react-icons/fi";
import { toast } from "sonner";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { apiServices } from "../../lib/services";

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await apiServices.orders.getUserOrders();

        if (response && response.success && response.orders) {
          const formattedOrders = response.orders.map((order) => ({
            id: order.id || order._id,
            date: order.createdAt,
            status: order.status, // Backend sends as 'status'
            total: order.total,
            items: order.items || [],
          }));
          setOrders(formattedOrders);
        } else {
          setOrders([]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <FiCheckCircle className="text-green-500" />;
      case "processing":
        return <FiClock className="text-amber-500" />;
      case "out_for_delivery":
        return <FiTruck className="text-blue-500" />;
      case "pending":
        return <FiPackage className="text-orange-500" />;
      case "cancelled":
        return <FiPackage className="text-red-500" />;
      default:
        return <FiPackage className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "processing":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "out_for_delivery":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatPrice = (price) => {
    return `₦${price.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent"></div>
            <span className="text-amber-800 font-medium">
              Loading your orders...
            </span>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-amber-700 hover:text-amber-800 transition-colors mb-4"
            >
              <FiArrowLeft />
              <span>Back</span>
            </button>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100">
              <h1 className="text-3xl font-bold text-amber-800 mb-2 flex items-center space-x-3">
                <FiPackage className="text-amber-600" />
                <span>My Orders</span>
              </h1>
              <p className="text-amber-600">
                Track and manage your food orders
              </p>
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100">
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-amber-50 rounded-xl p-6 border border-amber-200 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    onClick={() => handleOrderClick(order.id)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div className="flex items-center space-x-3 mb-2 md:mb-0">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          {getStatusIcon(order.status)}
                        </div>
                        <div>
                          <p className="font-bold text-amber-900">
                            Order #{order.id.slice(-8).toUpperCase()}
                          </p>
                          <p className="text-sm text-amber-700 flex items-center space-x-1">
                            <FiCalendar className="text-amber-600" />
                            <span>{formatDate(order.date)}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.replace("_", " ").toUpperCase()}
                        </span>
                        <p className="text-lg font-bold text-amber-800">
                          {formatPrice(order.total)}
                        </p>
                        <div className="flex items-center space-x-2 text-amber-600 group-hover:text-amber-800 transition-colors">
                          <FiEye />
                          <span className="text-sm">View Details</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-amber-900">
                            {item.product?.name || item.name} x{item.quantity}
                          </span>
                          <span className="text-amber-700 font-medium">
                            {formatPrice(item.product?.price || item.price)}
                          </span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-xs text-amber-600">
                          +{order.items.length - 3} more items
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiPackage className="text-4xl text-amber-600" />
                </div>
                <h3 className="text-lg font-medium text-amber-800 mb-2">
                  No Orders Yet
                </h3>
                <p className="text-amber-600 mb-6">
                  Start exploring our delicious menu!
                </p>
                <button
                  onClick={() => navigate("/menu")}
                  className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Browse Menu
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyOrdersPage;
