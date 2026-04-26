import { create } from "zustand";
import type { QueryClient } from "@tanstack/react-query";

// Services
import { getCurrentUser } from "@/services/api.services";

type UserState = {
  user: Me | null;
  loading: boolean;
  error: string | null;

  setUser: (user: Me) => void;
  clearUser: () => void;
  ensureUser: (queryClient?: QueryClient) => Promise<Me | null>;
};

export const meStore = create<UserState>((set, get) => ({
  user: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null, error: null }),

  ensureUser: async (queryClient) => {
    const existing = get().user;
    if (existing) return existing;

    set({ loading: true, error: null });

    try {
      // Try React Query cache
      if (queryClient) {
        const cached = queryClient.getQueryData<Me>(["profile", "me"]);
        if (cached) {
          set({ user: cached, loading: false });
          return cached;
        }
      }

      // Fallback to API
      const res = await getCurrentUser();

      if (res.status !== 200 || res.success !== true) {
        throw new Error("Failed to fetch user");
      }

      set({ user: res.data, loading: false });
      return res.data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error";
      set({ error: message, loading: false });
      return null;
    }
  },
}));