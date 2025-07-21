import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiUser,
  FiPhone,
  FiMail,
  FiCalendar,
  FiCreditCard,
  FiDownload,
} from "react-icons/fi";
import { toast } from "sonner";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { apiServices } from "../../lib/services";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiServices.orders.getOrderById(orderId);
        console.log("Order details response:", response); // Debug log

        if (response.success && response.order) {
          setOrder(response.order);
        } else {
          throw new Error(response.message || "Failed to fetch order");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order details:", error);

        // Handle different error types
        if (error.response?.status === 404) {
          setError("Order not found");
        } else if (error.response?.status === 403) {
          setError("You don't have permission to view this order");
        } else {
          setError("Failed to load order details");
        }

        setLoading(false);
        toast.error("Failed to load order details");
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]); // Re-fetch if orderId changes

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiServices.orders.getOrderById(orderId);
      console.log("Refresh order details response:", response); // Debug log

      if (response.success && response.order) {
        setOrder(response.order);
        toast.success("Order details refreshed");
      } else {
        throw new Error(response.message || "Failed to refresh order");
      }
    } catch (error) {
      console.error("Error refreshing order details:", error);
      toast.error("Failed to refresh order details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <FiCheckCircle className="text-green-500" />;
      case "processing":
        return <FiClock className="text-amber-500" />;
      case "out_for_delivery":
        return <FiTruck className="text-blue-500 text-base" />;
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

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
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

  const handleDownloadReceipt = () => {
    toast.success("Receipt download started");
    // Implement receipt download logic
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent"></div>
            <span className="text-amber-800 font-medium">
              Loading order details...
            </span>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPackage className="text-2xl text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Order Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              {error || "The order you're looking for doesn't exist."}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-amber-700 hover:text-amber-800 transition-colors mb-4"
            >
              <FiArrowLeft />
              <span>Back to Orders</span>
            </button>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-amber-800 mb-2">
                    Order #{order._id?.slice(-8)?.toUpperCase() || "N/A"}
                  </h1>
                  <p className="text-amber-600 flex items-center space-x-2">
                    <FiCalendar />
                    <span>Placed on {formatDate(order.createdAt)}</span>
                  </p>
                </div>

                <div className="mt-4 md:mt-0 flex flex-col md:items-end space-y-2">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleRefresh}
                      disabled={loading}
                      className="flex items-center space-x-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors disabled:opacity-50"
                      title="Refresh order status"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      <span>Refresh</span>
                    </button>
                    <span
                      className={`px-3 py-1 inline-flex items-center rounded-full text-sm font-medium border ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {getStatusIcon(order.orderStatus)}
                      <span className="ml-2 text-xs">
                        {order.orderStatus.replace("_", " ").toUpperCase()}
                      </span>
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getPaymentStatusColor(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus.toUpperCase()}
                    </span>
                  </div>

                  <button
                    onClick={handleDownloadReceipt}
                    className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    <FiDownload />
                    <span>Download Receipt</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100 mb-8">
                <h2 className="text-2xl font-bold text-amber-800 mb-6 flex items-center space-x-2">
                  <FiPackage className="text-amber-600" />
                  <span>Order Items</span>
                </h2>

                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={item._id || index}
                      className="flex items-center space-x-4 p-4 bg-amber-50 rounded-xl border border-amber-200"
                    >
                      <div className="w-20 h-20 bg-amber-200 rounded-lg flex items-center justify-center overflow-hidden">
                        {item.product.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FiPackage className="text-2xl text-amber-600" />
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-bold text-amber-900">
                          {item.product.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm mt-2">
                          <span className="text-amber-800">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-amber-800">
                            Price: {formatPrice(item.product.price)}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-amber-800">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-6 pt-6 border-t border-amber-200">
                  <div className="space-y-2">
                    <div className="flex justify-between text-amber-800">
                      <span>Subtotal</span>
                      <span>{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-amber-800">
                      <span>VAT (10%)</span>
                      <span>{formatPrice(order.vat)}</span>
                    </div>
                    <div className="flex justify-between text-amber-800">
                      <span>Delivery Fee</span>
                      <span>{formatPrice(order.deliveryFee)}</span>
                    </div>
                    <div className="border-t border-amber-200 pt-2">
                      <div className="flex justify-between text-lg font-bold text-amber-900">
                        <span>Total</span>
                        <span>{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div className="space-y-8">
              {/* Customer Information */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100">
                <h3 className="text-xl font-bold text-amber-800 mb-4 flex items-center space-x-2">
                  <FiUser className="text-amber-600" />
                  <span>Customer Information</span>
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-amber-800">
                    <FiUser className="text-amber-600" />
                    <span>
                      {order.firstName} {order.lastName}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-amber-800">
                    <FiMail className="text-amber-600" />
                    <span>{order.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-amber-800">
                    <FiPhone className="text-amber-600" />
                    <span>{order.phone}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100">
                <h3 className="text-xl font-bold text-amber-800 mb-4 flex items-center space-x-2">
                  <FiMapPin className="text-amber-600" />
                  <span>Delivery Address</span>
                </h3>

                <div className="text-amber-800 space-y-1">
                  <p>{order.address}</p>
                  <p>
                    {order.city}, {order.state}
                  </p>
                  <p>{order.zip}</p>
                  <p>{order.country}</p>
                </div>

                {order.deliveryNotes && (
                  <div className="mt-4 pt-4 border-t border-amber-200">
                    <p className="text-sm text-amber-700">
                      <strong>Delivery Notes:</strong> {order.deliveryNotes}
                    </p>
                  </div>
                )}
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100">
                <h3 className="text-xl font-bold text-amber-800 mb-4 flex items-center space-x-2">
                  <FiCreditCard className="text-amber-600" />
                  <span>Payment Information</span>
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-700">Payment Method</span>
                    <span className="text-amber-900 font-medium">
                      {order.paymentMethod === "paystack"
                        ? "Card Payment"
                        : order.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-700">Transaction ID</span>
                    <span className="text-amber-900 font-mono text-sm">
                      {order.transactionId}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-700">Status</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getPaymentStatusColor(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Timeline */}
              {order.orderStatus === "delivered" && order.deliveredAt && (
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100">
                  <h3 className="text-xl font-bold text-amber-800 mb-4 flex items-center space-x-2">
                    <FiTruck className="text-amber-600" />
                    <span>Delivery Timeline</span>
                  </h3>

                  <div className="space-y-3">
                    {order.expectedDeliveryDate && (
                      <div className="flex justify-between items-center">
                        <span className="text-amber-700">
                          Expected Delivery
                        </span>
                        <span className="text-amber-900">
                          {formatDate(order.expectedDeliveryDate)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-amber-700">Actual Delivery</span>
                      <span className="text-green-700 font-medium">
                        {formatDate(order.deliveredAt)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderDetails;
