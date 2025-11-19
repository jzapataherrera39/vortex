import useAuthStore from "../store/authStore";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, adminOnly }) {
  const { isAuthenticated, user } = useAuthStore((state) => state);

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (adminOnly && user.rol !== 'ADMIN') return <Navigate to="/" />;

  return children;
}
