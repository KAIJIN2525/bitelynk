import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Contact from "./pages/Contact/Contact";
import About from "./pages/AboutPage/AboutPage";
import Menu from "./pages/Menu/Menu";
import Cart from "./pages/Cart/Cart";
import SignUp from "./components/SignUp/SignUp";
import Profile from "./pages/Profile/Profile";
import OrderDetails from "./pages/OrderDetails/OrderDetails";
import OrderSuccess from "./pages/OrderSuccess/OrderSuccess";
import { Toaster } from "sonner";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import VerifyPayment from "./pages/VerifyPaymentPage/VerifyPaymentPage";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage";
import MyOrdersPage from "./pages/MyOrdersPage/MyOrdersPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/menu" element={<Menu />} />

        <Route path="/login" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />

        {/* PAYMENT VERIFICATION */}
        <Route path="/myorder/verify" element={<VerifyPayment />} />
        <Route path="/order-success" element={<OrderSuccess />} />

        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <CheckoutPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/myorders"
          element={
            <PrivateRoute>
              <MyOrdersPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/order/:orderId"
          element={
            <PrivateRoute>
              <OrderDetails />
            </PrivateRoute>
          }
        />
      </Routes>
      <Toaster richColors />
    </>
  );
};

export default App;
