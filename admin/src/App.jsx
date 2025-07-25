import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

// Components
import Layout from "./components/Layout";
import AdminLogin from "./components/AdminLogin";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./components/Dashboard";
import Products from "./components/Products";
import Orders from "./components/Orders";
import Users from "./components/Users";
import Profile from "./components/Profile";

const App = () => {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/signup" element={<AdminLogin />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "white",
            color: "#374151",
            border: "1px solid #e5e7eb",
            borderRadius: "0.75rem",
          },
        }}
      />
    </>
  );
};

export default App;
