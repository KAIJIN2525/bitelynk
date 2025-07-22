import Navbar from "./components/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import AdminLogin from "./components/AdminLogin";
import PrivateRoute from "./components/PrivateRoute";
import Products from "./pages/Products/Products";
import Orders from "./pages/Orders/Orders";
import Users from "./pages/Users/Users";
import Profile from "./pages/Profile/Profile";

const App = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {!isLoginPage && <Navbar />}
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Products />
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <Products />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <Users />
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
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
