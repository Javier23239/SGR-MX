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

  
  const userRole = (user.rol || user.ROL || "").toString().toUpperCase();
  const requiredRole = (role || "").toString().toUpperCase();

  if (requiredRole && userRole !== requiredRole) {
    console.warn(`Acceso Denegado. Rol usuario: ${userRole}, Rol requerido: ${requiredRole}`);
    
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;