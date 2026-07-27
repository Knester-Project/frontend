import { create } from 'zustand';

interface CryptoState {
    sessionKeys: Record<string, CryptoKey>;
    setSessionKey: (conversationId: string, key: CryptoKey) => void;
    getSessionKey: (conversationId: string) => CryptoKey | undefined;
}

export const useCryptoStore = create<CryptoState>((set, get) => ({
    sessionKeys: {},
    setSessionKey: (conversationId, key) => 
        set((state) => ({ sessionKeys: { ...state.sessionKeys, [conversationId]: key } })),
    getSessionKey: (conversationId) => get().sessionKeys[conversationId],
}));