import { create } from "zustand";

// Services
import { getCurrentUser } from "@/services/api.services";


type UserState = {
    user: Me | null;
    loading: boolean;
    error: string | null;

    setUser: (user: Me) => void;
    updateProfile: (profile: Partial<MyProfile>) => void;
    clearUser: () => void;
    fetchUser: () => Promise<void>;
};

export const meStore = create<UserState>((set, get) => ({
    user: null,
    loading: false,
    error: null,

    setUser: (user) => set({ user }),

    updateProfile: (profile) => {
        const current = get().user;
        if (!current || !current.profile) return;

        set({
            user: {
                ...current,
                profile: {
                    ...current.profile,
                    ...profile,
                },
            },
        });
    },

    clearUser: () => set({ user: null, error: null }),

    fetchUser: async () => {
        set({ loading: true, error: null });
        try {
            const res = await getCurrentUser()
            if (res.status !== 200 && res.success === true) throw new Error("Failed to fetch user");
            set({ user: res.data, loading: false });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Error";
            set({ error: message, loading: false });
        }
    },
}));