import { create } from 'zustand';

export type ReplyState = {
    message: Message;
    senderName: string;
};

interface ChatUIState {
    editingMessage: Message | null;
    replyingTo: ReplyState | null;
    setEditingMessage: (msg: Message | null) => void;
    setReplyingTo: (replyData: ReplyState | null) => void;
    clearUIState: () => void;
    activeConversationId: string | null;
    setActiveConversation: (id: string | null) => void;
}

export const useChatUIStore = create<ChatUIState>((set) => ({
    editingMessage: null,
    replyingTo: null,
    setEditingMessage: (msg) => set({ editingMessage: msg, replyingTo: null }),
    setReplyingTo: (replyData) => set({ replyingTo: replyData, editingMessage: null }),
    clearUIState: () => set({ editingMessage: null, replyingTo: null }),
    activeConversationId: null,
    setActiveConversation: (id) => set({ activeConversationId: id }),
}));