import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppData } from "../context/AppContext";

const ProtectedRoute = () => {
  const { isAuth, user, loading } = useAppData();
  const location = useLocation();

  if (loading) return null;

  // User not logged in
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // User logged in but role not selected
  if (user?.role === null && location.pathname !== "/select-role") {
    return <Navigate to="/select-role" replace />;
  }

  // User already selected role
  if (user?.role !== null && location.pathname === "/select-role") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;