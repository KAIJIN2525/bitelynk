import Navbar from "./components/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import AddItems from "./components/AddItems";
import List from "./components/List";
import Order from "./components/Order";
import { Toaster } from "sonner";
import EditItem from "./components/EditItem";
import AdminLogin from "./components/AdminLogin";
import PrivateRoute from "./components/PrivateRoute";

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
              <AddItems />
            </PrivateRoute>
          }
        />
        <Route
          path="/list"
          element={
            <PrivateRoute>
              <List />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <Order />
            </PrivateRoute>
          }
        />
        <Route
          path="/update/:id"
          element={
            <PrivateRoute>
              <EditItem />
            </PrivateRoute>
          }
        />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
