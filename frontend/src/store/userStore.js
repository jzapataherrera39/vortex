import { create } from "zustand";
import useAuthStore from "./authStore"; // Importamos authStore para obtener el token

// URL base del backend (Asegúrate que coincida con tu puerto)
const API_URL = "http://localhost:5000/api";

const userStore = create((set, get) => ({
  users: [], // Estado inicial como array vacío
  
  fetchUsers: async () => {
    // Obtenemos el token de la store de auth
    const token = useAuthStore.getState().token;
    
    if (!token) {
        set({ users: [] }); // Si no hay token, limpiamos usuarios
        return;
    }

    try {
      const res = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error('Error al obtener usuarios');
      
      const data = await res.json();
      
      // --- CORRECCIÓN CRÍTICA ---
      // Verificamos si 'data' es un array. Si no, intentamos buscar data.users o devolvemos array vacío.
      // Esto evita el error "users.map is not a function"
      const userArray = Array.isArray(data) ? data : (data.users || []);
      
      set({ users: userArray });
      
    } catch (error) {
      console.error("Error fetching users:", error);
      set({ users: [] }); // En caso de error, aseguramos que sea un array vacío
    }
  },

  // ... mantén el resto de funciones (createUser, updateUser, toggleUserState) igual ...
  // Asegúrate de usar useAuthStore.getState().token en ellas también.
}));

export default userStore;