import { create } from 'zustand';

interface TypingState {
    typingUsers: Record<string, Set<string>>;
    addTypingUser: (conversationId: string, userId: string) => void;
    removeTypingUser: (conversationId: string, userId: string) => void;
}

export const useTypingStore = create<TypingState>((set) => ({
    typingUsers: {},
    addTypingUser: (convId, userId) => set((state) => {
        const currentSet = state.typingUsers[convId] || new Set();
        const newSet = new Set(currentSet).add(userId);
        return { typingUsers: { ...state.typingUsers, [convId]: newSet } };
    }),
    removeTypingUser: (convId, userId) => set((state) => {
        const currentSet = state.typingUsers[convId];
        if (!currentSet) return state;
        const newSet = new Set(currentSet);
        newSet.delete(userId);
        return { typingUsers: { ...state.typingUsers, [convId]: newSet } };
    }),
}));
