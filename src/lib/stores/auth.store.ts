import { create } from "zustand";
import type { ILoggedInUser } from "@/features/auth/interfaces/user.interface";
import { authApi } from "@/features/auth/api/auth.api";

interface AuthState {
  user: ILoggedInUser | null;

  isLoading: boolean;

  setUser: (user: ILoggedInUser | null) => void;

  setLoading: (loading: boolean) => void;

  clearUser: () => void;

  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  isLoading: true,

  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),

  setUser: (user) =>
    set({
      user,
      isLoading: false,
    }),

  clearUser: () =>
    set({
      user: null,
      isLoading: false,
    }),

  refreshUser: async () => {
    try {
      const user = await authApi.me();

      set({
        user: user.data,
        isLoading: false,
      });
    } catch {
      set({
        user: null,
        isLoading: false,
      });
    }
  },
}));
