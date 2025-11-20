import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginRequest } from "../api/authApi";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,

      login: async ({ email, password }) => {
        set({ loading: true });

        try {
          const res = await loginRequest({ email, password });

          // Backend responde: { _id, nombre, email, rol, token }
          if (!res.token) {
            throw new Error(res.message || "Credenciales incorrectas");
          }

          set({
            user: {
              _id: res._id,
              nombre: res.nombre,
              email: res.email,
              rol: res.rol,
            },
            token: res.token,
            isAuthenticated: true,
            loading: false,
          });

          return { success: true };
        } catch (err) {
          set({ loading: false });
          return {
            success: false,
            message: err.message || "Error al iniciar sesión",
          };
        }
      },

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
