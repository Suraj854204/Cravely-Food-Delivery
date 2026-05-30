import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppData } from "../context/AppContext";

const ProtectedRoute = () => {
  const { isAuth, user, loading } = useAppData();
  const location = useLocation();

  if (loading) {
    return null;
  }

  // Not logged in
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // Role not selected
  if (!user?.role && location.pathname !== "/select-role") {
    return <Navigate to="/select-role" replace />;
  }

  // Role already selected
  if (user?.role && location.pathname === "/select-role") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;