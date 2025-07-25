import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit2,
  FiSave,
  FiX,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiCalendar,
  FiEye,
  FiLogOut,
} from "react-icons/fi";
import { toast } from "sonner";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { apiServices } from "../../lib/services";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+234 123 456 7890",
    address: "123 Food Street, Lagos, Nigeria",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Fetch user profile and orders in parallel
        const [profileResponse, ordersResponse] = await Promise.all([
          apiServices.user.getProfile().catch((err) => {
            console.error("Profile API error:", err);
            return null;
          }),
          apiServices.orders.getUserOrders().catch((err) => {
            console.error("Orders API error:", err);
            return { success: false, data: [] };
          }),
        ]);

        // Set user data if available, otherwise use default
        if (profileResponse && profileResponse.success) {
          setUser(profileResponse.user || profileResponse.data);
          setEditedUser(profileResponse.user || profileResponse.data);
        }

        // Set orders if available
        if (ordersResponse && ordersResponse.success && ordersResponse.orders) {
          const formattedOrders = ordersResponse.orders.map((order) => ({
            id: order.id || order._id,
            date: order.createdAt,
            status: order.status, // Backend sends as 'status'
            total: order.total,
            paymentMethod: order.paymentMethod,
            items: order.items || [],
          }));
          setOrders(formattedOrders);
        } else {
          // No orders found - set empty array
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load profile data");

        // Set empty orders array instead of dummy data
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedUser(user);
  };

  const handleSave = async () => {
    try {
      const response = await apiServices.user.updateProfile(editedUser);
      if (response.success) {
        setUser(editedUser);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
      // For demo purposes, still update locally
      setUser(editedUser);
      setIsEditing(false);
      toast.success("Profile updated locally (demo mode)");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user);
  };

  const handleInputChange = (field, value) => {
    setEditedUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOrderClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  const handleLogout = () => {
    apiServices.auth.logout();
    navigate("/");
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <FiCheckCircle className="text-green-500" />;
      case "processing":
        return <FiClock className="text-amber-500" />;
      case "out_for_delivery":
        return <FiTruck className="text-blue-500" />;
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
              Loading profile...
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
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-3xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-amber-700/10" />
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30">
                  <FiUser className="text-6xl text-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-4xl font-bold mb-2 font-serif">
                    {user.name}
                  </h1>
                  <p className="text-amber-100 text-lg mb-4">Food Enthusiast</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <FiMail className="text-amber-200" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiPhone className="text-amber-200" />
                      <span>{user.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleEdit}
                    className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white font-medium hover:bg-white/30 transition-all duration-300 flex items-center justify-center space-x-2 border border-white/30"
                  >
                    <FiEdit2 />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-3 bg-red-600/80 backdrop-blur-sm rounded-xl text-white font-medium hover:bg-red-600 transition-all duration-300 flex items-center justify-center space-x-2 border border-red-500/30"
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100">
                <h2 className="text-2xl font-bold text-amber-800 mb-6 flex items-center space-x-2">
                  <FiUser className="text-amber-600" />
                  <span>Profile Information</span>
                </h2>

                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <label className="block text-sm font-medium text-amber-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    ) : (
                      <p className="text-amber-900 font-medium">{user.name}</p>
                    )}
                  </div>

                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <label className="block text-sm font-medium text-amber-700 mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedUser.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    ) : (
                      <p className="text-amber-900 font-medium">{user.email}</p>
                    )}
                  </div>

                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <label className="block text-sm font-medium text-amber-700 mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedUser.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    ) : (
                      <p className="text-amber-900 font-medium">{user.phone}</p>
                    )}
                  </div>

                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <label className="block text-sm font-medium text-amber-700 mb-2">
                      Address
                    </label>
                    {isEditing ? (
                      <textarea
                        value={
                          typeof editedUser.address === "object" &&
                          editedUser.address !== null
                            ? [
                                editedUser.address.street,
                                editedUser.address.city,
                                editedUser.address.state,
                                editedUser.address.postalCode,
                              ]
                                .filter(Boolean)
                                .join(", ")
                            : editedUser.address
                        }
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        rows="3"
                        placeholder="e.g. 123 Food Street, Lagos, Nigeria"
                        className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                      />
                    ) : (
                      <p className="text-amber-900 font-medium">
                        {typeof user.address === "object" &&
                        user.address !== null
                          ? [
                              user.address.street,
                              user.address.city,
                              user.address.state,
                              user.address.postalCode,
                            ]
                              .filter(Boolean)
                              .join(", ")
                          : user.address}
                      </p>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={handleSave}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <FiSave />
                        <span>Save Changes</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all duration-300 flex items-center space-x-2"
                      >
                        <FiX />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order History */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100">
                <h2 className="text-2xl font-bold text-amber-800 mb-6 flex items-center space-x-2">
                  <FiPackage className="text-amber-600" />
                  <span>Order History</span>
                </h2>

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
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center text-sm"
                          >
                            <span className="text-amber-900">
                              {item.name} x{item.quantity}
                            </span>
                            <span className="text-amber-700 font-medium">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {orders.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiPackage className="text-4xl text-amber-600" />
                    </div>
                    <h3 className="text-lg font-medium text-amber-800 mb-2">
                      No Orders Yet
                    </h3>
                    <p className="text-amber-600">
                      Start exploring our delicious menu!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
