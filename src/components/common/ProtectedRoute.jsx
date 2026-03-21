import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import FullPageLoader from "./FullPageLoader";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullPageLoader />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.rol !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;