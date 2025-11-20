import { create } from "zustand";
import api from "../api/api"; // Importamos tu instancia configurada con el interceptor

const userStore = create((set, get) => ({
  users: [],

  // 1. Obtener todos los usuarios
  fetchUsers: async () => {
    try {
      // Usamos api.get, el token se inyecta solo gracias a api.js
      const { data } = await api.get("/users");
      set({ users: data });
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  },

  // 2. Crear usuario
  createUser: async (userData) => {
    try {
      const { data } = await api.post("/users", userData);
      
      // Actualizamos el estado localmente para que la lista se vea actualizada de inmediato
      set((state) => ({ users: [...state.users, data] }));
      
      return { success: true, data };
    } catch (error) {
      console.error("Error creating user:", error);
      // Devolvemos info útil del error para mostrar alertas en el componente
      const errorMessage = error.response?.data?.message || "Error al crear usuario";
      return { success: false, message: errorMessage };
    }
  },

  // 3. Editar usuario
  updateUser: async (id, userData) => {
    try {
      const { data } = await api.put(`/users/${id}`, userData);
      
      // Actualizamos solo el usuario modificado en la lista
      set((state) => ({
        users: state.users.map((user) => (user._id === id ? data : user)),
      }));
      
      return { success: true, data };
    } catch (error) {
      console.error("Error updating user:", error);
      return { success: false, message: error.response?.data?.message || "Error al actualizar" };
    }
  },

  // 4. Activar/Inactivar usuario
  toggleUserState: async (id, newState) => {
    try {
      const { data } = await api.put(`/users/${id}/toggle`, { state: newState });
      
      // Actualizamos el estado específico del usuario en la lista
      set((state) => ({
        users: state.users.map((user) => 
          user._id === id ? { ...user, state: data.state } : user
        ),
      }));
      
      return true;
    } catch (error) {
      console.error("Error toggling user state:", error);
      return false;
    }
  },
  // 5. Eliminar usuario permanentemente (NUEVO)
  deleteUser: async (id) => {
    try {
      await api.delete(`/users/${id}`);
      
      // Filtramos el usuario eliminado de la lista local para que desaparezca al instante
      set((state) => ({
        users: state.users.filter((user) => user._id !== id),
      }));
      
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  },

}));

export default userStore;