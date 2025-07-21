import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiCheckCircle, FiLoader, FiXCircle } from "react-icons/fi";
import { toast } from "sonner";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { orderService } from "../../lib/services/orderService";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, failed
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get("reference");

      if (!reference) {
        setStatus("failed");
        setError("No payment reference found");
        return;
      }

      try {
        console.log("Verifying payment with reference:", reference);
        const response = await orderService.verifyPayment(reference);

        console.log("Payment verification response:", response);

        if (response.success) {
          setStatus("success");
          setOrderData(response.order);
          toast.success(response.message || "Payment verified successfully!");
        } else {
          setStatus("failed");
          setError(response.message || "Payment verification failed");
          toast.error(response.message || "Payment verification failed");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("failed");
        setError("Payment verification failed");
        toast.error("Payment verification failed");
      }
    };

    verifyPayment();
  }, [searchParams]);

  const handleViewOrder = () => {
    if (orderData?.id) {
      navigate(`/order/${orderData.id}`);
    } else {
      navigate("/my-orders");
    }
  };

  const handleContinueShopping = () => {
    navigate("/menu");
  };

  if (status === "verifying") {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center py-8 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full border border-amber-100">
            <FiLoader className="text-6xl text-amber-500 animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Verifying Payment
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your payment...
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (status === "failed") {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center py-8 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full border border-red-100">
            <FiXCircle className="text-6xl text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-6">
              {error ||
                "There was an issue with your payment. Please try again."}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/checkout")}
                className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Try Again
              </button>
              <button
                onClick={handleContinueShopping}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center py-8 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full border border-green-100">
          <FiCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-2">
            Thank you for your order! Your payment has been processed
            successfully.
          </p>

          {orderData && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-700">
                <span className="font-medium">Order ID:</span> #
                {orderData.id?.slice(-8)?.toUpperCase() || "N/A"}
              </p>
              <p className="text-sm text-green-700">
                <span className="font-medium">Status:</span>{" "}
                {orderData.status || "Confirmed"}
              </p>
              <p className="text-sm text-green-700">
                <span className="font-medium">Amount:</span> ₦
                {orderData.total?.toLocaleString() || "N/A"}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleViewOrder}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              View Order Details
            </button>
            <button
              onClick={handleContinueShopping}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderSuccess;
