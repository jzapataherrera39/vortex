import { create } from "zustand";
import { loginRequest } from "../api/authApi";
import { jwtDecode } from "jwt-decode";

const useAuthStore = create((set, get) => ({
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  isAuthenticated: !!(typeof window !== "undefined" && localStorage.getItem("token")),

  login: async (email, password) => {
    try {
      const res = await loginRequest(email, password);

      if (res?.token) {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", res.token);
        }

        set({
          user: res.user,
          token: res.token,
          isAuthenticated: true,
        });
      }

      return res;
    } catch (err) {
      console.error("login error:", err);
      return { success: false, message: err.message || "Login failed" };
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    set({ user: null, token: null, isAuthenticated: false });
  },

  getUserFromToken: () => {
    const token = get().token;
    if (token) {
      const decoded = jwtDecode(token);
      set({ user: decoded });
    }
  },
}));

export default useAuthStore;
