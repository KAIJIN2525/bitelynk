import { Navigate } from "react-router-dom";
import { apiServices } from "../../lib/services";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = apiServices.auth.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
