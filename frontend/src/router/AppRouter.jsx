import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

import Welcome from "../pages/Welcome";
import LoginPage from "../pages/LoginPage";
import PoolList from "../pages/Pools/PoolList";
import PoolCreate from "../pages/Pools/CreatePool";
import PoolEdit from "../pages/Pools/EditPool";
import UsersList from "../pages/Users/UsersList";
import EditUser from "../pages/Users/EditUser";

export default function AppRouter() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas protegidas */}
      <Route
        path="/pools"
        element={
          <PrivateRoute>
            <PoolList />
          </PrivateRoute>
        }
      />

      <Route
        path="/pools/create"
        element={
          <PrivateRoute adminOnly>
            <PoolCreate />
          </PrivateRoute>
        }
      />

      <Route
        path="/pools/edit/:id"
        element={
          <PrivateRoute adminOnly>
            <PoolEdit />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <PrivateRoute adminOnly>
            <UsersList />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/users/edit/:id"
        element={
          <PrivateRoute adminOnly>
            <EditUser />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
