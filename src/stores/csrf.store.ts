import { create } from "zustand";

// Services
import { fetchToken } from './../services/api.services';

type SecurityStore = {
  csrfToken: string | null;
  setCsrfToken: (token: string) => void;
  ensureCsrfToken: () => Promise<string>;
};

export const useSecurityStore = create<SecurityStore>((set, get) => ({

  csrfToken: null,
  setCsrfToken: (token) => set({ csrfToken: token }),
  ensureCsrfToken: async () => {
    // Check if the CSRF token is null
    if (!get().csrfToken) {
      const response = await fetchToken();
      set({ csrfToken: response.data });
      return response.data; 
    }
    // Return the existing token if it's already set
    return get().csrfToken!;
  },
}));

export const getCsrfToken = async () => {
  const csrfToken = await useSecurityStore.getState().ensureCsrfToken();
  return csrfToken;
};