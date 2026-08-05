import { create } from 'zustand';

interface ChatUIState {
    editingMessage: Message | null;
    replyingToMessage: Message | null;
    setEditingMessage: (msg: Message | null) => void;
    setReplyingToMessage: (msg: Message | null) => void;
    clearUIState: () => void;
}

export const useChatUIStore = create<ChatUIState>((set) => ({
    editingMessage: null,
    replyingToMessage: null,
    setEditingMessage: (msg) => set({ editingMessage: msg, replyingToMessage: null }),
    setReplyingToMessage: (msg) => set({ replyingToMessage: msg, editingMessage: null }),
    clearUIState: () => set({ editingMessage: null, replyingToMessage: null }),
}));