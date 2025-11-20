// src/store/poolStore.js
import { create } from "zustand";
import {
  getPools,
  createPool,
  updatePool,
  deletePool,
  togglePoolStatus
} from "../api/poolsApi";

const poolStore = create((set, get) => ({
  pools: [],
  loading: false,

  fetchPools: async () => {
    set({ loading: true });
    try {
      const data = await getPools();
      set({ pools: data, loading: false });
    } catch (err) {
      console.error("Error fetching pools:", err);
      set({ loading: false });
    }
  },
  addPool: async (poolData) => {
    try {
      const newPool = await createPool(poolData);
      set({ pools: [...get().pools, newPool] });
    } catch (err) {
      console.error("Error adding pool:", err);
    }
  },

  editPool: async (id, poolData) => {
    try {
      const updatedPool = await updatePool(id, poolData);
      set({
        pools: get().pools.map((p) => (p._id === id ? updatedPool : p))
      });
    } catch (err) {
      console.error("Error editing pool:", err);
    }
  },
toggleStatus: async (id) => {
    try {
      const updatedPool = await togglePoolStatus(id);
      // Actualizamos la lista localmente para reflejar el cambio sin recargar
      set({
        pools: get().pools.map((p) => (p._id === id ? updatedPool : p))
      });
    } catch (err) {
      console.error("Error toggling pool status:", err);
    }
  },

  deletePool: async (id) => {
    try {
      await deletePool(id);
      set({
        pools: get().pools.filter((p) => p._id !== id)
      });
    } catch (err) {
      console.error("Error deleting pool:", err);
    }
  }
}));

export default poolStore;
