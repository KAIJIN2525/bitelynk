import { useState, useEffect } from "react";
import { useCart } from "../../CartContext/CartContext";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaCreditCard,
  FaMoneyBillAlt,
  FaSpinner,
  FaArrowLeft,
} from "react-icons/fa";
import { formatPrice } from "../../utils/priceUtils";
import { orderService } from "../../lib/services/orderService";
import { userService } from "../../lib/services/userService";
import { toast } from "sonner";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Form state
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [deliveryAddress, setDeliveryAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
    country: "Nigeria", // Default to Nigeria
  });

  const [paymentMethod, setPaymentMethod] = useState("paystack");
  const [orderNotes, setOrderNotes] = useState("");

  // Delivery fee calculation (example logic)
  const calculateDeliveryFee = (city, state) => {
    const cityLower = city.toLowerCase();
    const stateLower = state.toLowerCase();

    // Free delivery for Abuja
    if (stateLower.includes("abuja") || stateLower.includes("fct")) {
      return 0;
    }

    // Lagos delivery
    if (stateLower.includes("lagos")) {
      return 1000;
    }

    // Other major cities
    const majorCities = [
      "kano",
      "ibadan",
      "kaduna",
      "port harcourt",
      "benin",
      "jos",
      "ilorin",
    ];
    if (majorCities.some((city) => cityLower.includes(city))) {
      return 1500;
    }

    // Default delivery fee for other locations
    return 2000;
  };

  const deliveryFee = calculateDeliveryFee(
    deliveryAddress.city,
    deliveryAddress.state
  );
  const vat = cartTotal * 0.075; // 7.5% VAT
  const totalAmount = cartTotal + deliveryFee + vat;

  // Load user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoadingProfile(true);
        const response = await userService.getUserProfile();

        if (response.success && response.data) {
          const userData = response.data;

          // Set user info
          setUserInfo({
            firstName: userData.username
              ? userData.username.split(" ")[0] || userData.username
              : "",
            lastName: userData.username
              ? userData.username.split(" ")[1] || ""
              : "",
            email: userData.email || "",
          });

          // Handle both structured and string address formats
          let addressData = userData.address;
          if (typeof addressData === "string") {
            // If address is a string, try to parse it or leave fields empty
            setDeliveryAddress({
              street: addressData || "",
              city: "",
              state: "",
              postalCode: "",
              phone: userData.phone || "",
              country: "Nigeria",
            });
          } else {
            // If address is an object, use the structured data
            setDeliveryAddress({
              street: addressData?.street || "",
              city: addressData?.city || "",
              state: addressData?.state || "",
              postalCode: addressData?.postalCode || "",
              phone: userData.phone || "",
              country: "Nigeria",
            });
          }
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadUserProfile();
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !loading) {
      toast.error("Your cart is empty");
      navigate("/cart");
    }
  }, [cartItems, navigate, loading]);

  const handleAddressChange = (field, value) => {
    setDeliveryAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!userInfo.firstName.trim()) {
      toast.error("Please enter your first name");
      return false;
    }
    if (!userInfo.lastName.trim()) {
      toast.error("Please enter your last name");
      return false;
    }
    if (!userInfo.email.trim()) {
      toast.error("Please enter your email address");
      return false;
    }
    if (!deliveryAddress.street.trim()) {
      toast.error("Please enter your street address");
      return false;
    }
    if (!deliveryAddress.city.trim()) {
      toast.error("Please enter your city");
      return false;
    }
    if (!deliveryAddress.state.trim()) {
      toast.error("Please enter your state");
      return false;
    }
    if (!deliveryAddress.phone.trim()) {
      toast.error("Please enter your phone number");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const orderData = {
        // User information (required by backend)
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
        phone: deliveryAddress.phone,

        // Address information (required by backend)
        address: deliveryAddress.street,
        city: deliveryAddress.city,
        state: deliveryAddress.state,
        zip: deliveryAddress.postalCode || "",
        country: deliveryAddress.country || "Nigeria",

        // Payment and delivery
        paymentMethod,
        deliveryFee,

        // Optional fields
        deliveryNotes: orderNotes,
      };

      const response = await orderService.createOrder(orderData);
      console.log("Order response:", response); // Debug log

      // Check if the response exists and has a success property
      if (!response) {
        throw new Error("No response received from server");
      }

      if (response.success) {
        // Clear cart after successful order
        await clearCart();

        // Show success message
        toast.success(response.message || "Order placed successfully!");

        // For Paystack payment, redirect to payment URL
        if (
          paymentMethod === "paystack" &&
          response.payment?.authorization_url
        ) {
          window.location.href = response.payment.authorization_url;
        } else {
          // For COD or after successful payment, redirect to order page
          const orderId = response.order?.id || response.data?._id;
          if (orderId) {
            navigate(`/order/${orderId}`);
          } else {
            navigate("/my-orders");
          }
        }
      } else {
        throw new Error(response.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);

      // Handle different types of errors
      let errorMessage = "Failed to place order. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-[#1a120b] via-[#2a1e14] to-[#3e2b1d] flex items-center justify-center">
          <div className="text-center">
            <FaSpinner className="text-4xl text-amber-300 animate-spin mx-auto mb-4" />
            <p className="text-amber-100 font-cinzel">Loading checkout...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#1a120b] via-[#2a1e14] to-[#3e2b1d] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/cart")}
              className="flex items-center gap-2 text-amber-300 hover:text-amber-100 transition-colors mb-4"
            >
              <FaArrowLeft />
              <span className="font-cinzel">Back to Cart</span>
            </button>

            <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4">
              <span className="font-dancingscript bg-gradient-to-r from-amber-100 to-amber-400 bg-clip-text text-transparent">
                Checkout
              </span>
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Forms */}
            <div className="space-y-8">
              {/* Personal Information */}
              <div className="bg-amber-900/20 p-6 rounded-2xl border border-amber-800/30 backdrop-blur-sm">
                <h2 className="text-2xl font-dancingscript text-amber-100 mb-6">
                  Personal Information
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-amber-100 font-cinzel mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={userInfo.firstName}
                        onChange={(e) =>
                          setUserInfo((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 bg-amber-900/30 border border-amber-800/50 rounded-lg text-amber-100 placeholder-amber-300/50 focus:outline-none focus:border-amber-600 transition-colors"
                        placeholder="First Name"
                      />
                    </div>

                    <div>
                      <label className="block text-amber-100 font-cinzel mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={userInfo.lastName}
                        onChange={(e) =>
                          setUserInfo((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 bg-amber-900/30 border border-amber-800/50 rounded-lg text-amber-100 placeholder-amber-300/50 focus:outline-none focus:border-amber-600 transition-colors"
                        placeholder="Last Name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-amber-100 font-cinzel mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={userInfo.email}
                      onChange={(e) =>
                        setUserInfo((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 bg-amber-900/30 border border-amber-800/50 rounded-lg text-amber-100 placeholder-amber-300/50 focus:outline-none focus:border-amber-600 transition-colors"
                      placeholder="Email Address"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-amber-900/20 p-6 rounded-2xl border border-amber-800/30 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-dancingscript text-amber-100 flex items-center gap-2">
                    <FaMapMarkerAlt />
                    Delivery Address
                  </h2>
                  {(deliveryAddress.street ||
                    deliveryAddress.city ||
                    deliveryAddress.state) && (
                    <div className="text-xs text-amber-300 font-cinzel">
                      ✓ Loaded from profile
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {!deliveryAddress.street &&
                    !deliveryAddress.city &&
                    !deliveryAddress.state && (
                      <div className="text-amber-300/80 text-sm font-cinzel mb-4 p-3 bg-amber-900/10 rounded-lg">
                        💡 Fill in your delivery address below. You can update
                        your profile later to save this information for future
                        orders.
                      </div>
                    )}

                  <div>
                    <label className="block text-amber-100 font-cinzel mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.street}
                      onChange={(e) =>
                        handleAddressChange("street", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-amber-900/30 border border-amber-800/50 rounded-lg text-amber-100 placeholder-amber-300/50 focus:outline-none focus:border-amber-600 transition-colors"
                      placeholder="Enter your street address"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-amber-100 font-cinzel mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress.city}
                        onChange={(e) =>
                          handleAddressChange("city", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-amber-900/30 border border-amber-800/50 rounded-lg text-amber-100 placeholder-amber-300/50 focus:outline-none focus:border-amber-600 transition-colors"
                        placeholder="City"
                      />
                    </div>

                    <div>
                      <label className="block text-amber-100 font-cinzel mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress.state}
                        onChange={(e) =>
                          handleAddressChange("state", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-amber-900/30 border border-amber-800/50 rounded-lg text-amber-100 placeholder-amber-300/50 focus:outline-none focus:border-amber-600 transition-colors"
                        placeholder="State"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-amber-100 font-cinzel mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress.postalCode}
                        onChange={(e) =>
                          handleAddressChange("postalCode", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-amber-900/30 border border-amber-800/50 rounded-lg text-amber-100 placeholder-amber-300/50 focus:outline-none focus:border-amber-600 transition-colors"
                        placeholder="Postal Code"
                      />
                    </div>

                    <div>
                      <label className="block text-amber-100 font-cinzel mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={deliveryAddress.phone}
                        onChange={(e) =>
                          handleAddressChange("phone", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-amber-900/30 border border-amber-800/50 rounded-lg text-amber-100 placeholder-amber-300/50 focus:outline-none focus:border-amber-600 transition-colors"
                        placeholder="Phone Number"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-amber-900/20 p-6 rounded-2xl border border-amber-800/30 backdrop-blur-sm">
                <h2 className="text-2xl font-dancingscript text-amber-100 mb-6 flex items-center gap-2">
                  <FaCreditCard />
                  Payment Method
                </h2>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paystack"
                      checked={paymentMethod === "paystack"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-amber-500 focus:ring-amber-500"
                    />
                    <FaCreditCard className="text-amber-300" />
                    <span className="text-amber-100 font-cinzel">
                      Card Payment (Paystack)
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={paymentMethod === "Cash on Delivery"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-amber-500 focus:ring-amber-500"
                    />
                    <FaMoneyBillAlt className="text-amber-300" />
                    <span className="text-amber-100 font-cinzel">
                      Cash on Delivery
                    </span>
                  </label>
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-amber-900/20 p-6 rounded-2xl border border-amber-800/30 backdrop-blur-sm">
                <h2 className="text-2xl font-dancingscript text-amber-100 mb-6">
                  Order Notes (Optional)
                </h2>

                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-amber-900/30 border border-amber-800/50 rounded-lg text-amber-100 placeholder-amber-300/50 focus:outline-none focus:border-amber-600 transition-colors resize-none"
                  placeholder="Any special instructions for your order..."
                />
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:sticky lg:top-16 lg:self-start">
              <div className="bg-amber-900/20 p-6 rounded-2xl border border-amber-800/30 backdrop-blur-sm">
                <h2 className="text-2xl font-dancingscript text-amber-100 mb-6">
                  Order Summary
                </h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-3 bg-amber-900/10 rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-contain rounded"
                      />
                      <div className="flex-1">
                        <h3 className="text-amber-100 font-cinzel text-sm">
                          {item.name}
                        </h3>
                        <p className="text-amber-300/80 text-xs">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-amber-300 font-cinzel text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-amber-800/30 pt-4 space-y-2">
                  <div className="flex justify-between text-amber-100 font-cinzel">
                    <span>Subtotal:</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>

                  <div className="flex justify-between text-amber-100 font-cinzel">
                    <span>Delivery Fee:</span>
                    <span className={deliveryFee === 0 ? "text-green-400" : ""}>
                      {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                    </span>
                  </div>

                  <div className="flex justify-between text-amber-100 font-cinzel">
                    <span>VAT (7.5%):</span>
                    <span>{formatPrice(vat)}</span>
                  </div>

                  <div className="border-t border-amber-800/30 pt-2 mt-2">
                    <div className="flex justify-between text-amber-100 font-dancingscript text-xl">
                      <span>Total:</span>
                      <span>{formatPrice(totalAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || cartItems.length === 0}
                  className="w-full mt-6 bg-gradient-to-r from-amber-900/60 to-amber-700/60 hover:from-amber-800/80 hover:to-amber-600/80 disabled:from-gray-600/50 disabled:to-gray-700/50 text-amber-100 py-4 rounded-lg font-cinzel uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Placing Order...</span>
                    </>
                  ) : (
                    <span>Place Order</span>
                  )}
                </button>

                {deliveryFee === 0 && (
                  <p className="text-center text-green-400 text-sm font-cinzel mt-2">
                    🎉 Free delivery to your location!
                  </p>
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

export default CheckoutPage;
