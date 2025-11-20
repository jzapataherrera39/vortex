// src/router/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function PrivateRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user, loading } = useAuthStore();

  if (loading) return <div>Cargando...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (adminOnly && user?.rol !== "ADMIN") return <Navigate to="/" replace />;

  return children;
}
