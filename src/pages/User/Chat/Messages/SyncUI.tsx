/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, type RefObject } from 'react';

// Utils and Stores
import { getSocket } from '@/utils/socket';
import { parseRedisMessage } from '@/utils/format';
import { saveMessages, updateReadStatus } from '@/utils/chat/local.storage';
import { decrypt } from '@/utils/chat/encrytion';
import { useChatUIStore } from '@/stores/chatUI.store';
import { useCryptoStore } from '@/stores/crypto.store';

// Set Active Conversation
export const useJoinActiveConv = (conversationId: string | null) => {

    const { setActiveConversation } = useChatUIStore();

    useEffect(() => {
        if (!conversationId) return;
        setActiveConversation(conversationId);

        // Clear it when the user leaves the page
        return () => setActiveConversation(null);
    }, [conversationId, setActiveConversation]);

}

// Join Chat Room and Update Read Status
export const useJoinChatRoom = (conversationId: string | null, userId: string | undefined) => {
    useEffect(() => {
        if (!conversationId || !userId) return;

        const interval = setInterval(() => {
            const socket = getSocket();
            if (socket && socket.connected) {
                socket.emit("conversation:join", conversationId);
                updateReadStatus(conversationId, userId, socket);

                // Clear the interval
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [conversationId, userId]);
};

// Sync Messages to Dexie
export const useSyncToDexie = (messagesData: any) => {
    useEffect(() => {
        if (!messagesData || !messagesData.pages) return;

        const syncToLocal = async () => {
            const allFetchedMessages = messagesData.pages.flatMap((page: any) => page.data.messages || []);
            if (allFetchedMessages.length === 0) return;

            // Format messages for Dexie and Save
            const formattedForDexie = allFetchedMessages.map((msg: any) => parseRedisMessage(msg));
            await saveMessages(formattedForDexie);
        };

        syncToLocal();
    }, [messagesData]);
};

// Scroll to Bottom Logic
export const useChatScroll = (
    messagesEndRef: RefObject<HTMLDivElement | null>,
    localMessages: Message[] | undefined,
) => {
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

    const scrollToBottom = () => {
        requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        });
    };

    useEffect(() => {
        if (!localMessages || localMessages.length === 0) return;

        if (isInitialLoad) {
            setTimeout(scrollToBottom, 100);
            setIsInitialLoad(false);
        } else {
            scrollToBottom();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localMessages?.length]);
};

// For the Inputs
export const useInputStates = (inputRef: RefObject<HTMLTextAreaElement | null>) => {

    const { editingMessage, replyingTo } = useChatUIStore();
    const getSessionKey = useCryptoStore((state) => state.getSessionKey);

    // States
    const [text, setText] = useState<string>("");
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<{ url: string; type: "image" | "video" }[]>([]);
    const [retainedMedia, setRetainedMedia] = useState<string[]>([]);
    const [replyPreviewText, setReplyPreviewText] = useState<string>("");
    const [originalReplyToId, setOriginalReplyToId] = useState<string | null>(null);

    // Auto-Expanding Textarea Logic
    useEffect(() => {

        const textarea = inputRef.current;
        if (!textarea) return;

        const MIN_HEIGHT = 44;
        const MAX_HEIGHT = 144;

        // Reset height first so the textarea can shrink when text is deleted
        textarea.style.height = "auto";

        // Get the actual height required by the content
        const scrollHeight = textarea.scrollHeight;

        // Keep height between MIN_HEIGHT and MAX_HEIGHT
        const height = Math.min(
            Math.max(scrollHeight, MIN_HEIGHT),
            MAX_HEIGHT
        );

        textarea.style.height = `${height}px`;
        textarea.style.overflowY = scrollHeight > MAX_HEIGHT ? "auto" : "hidden";
    }, [inputRef, text]);

    // Handle Editing (Decrypt original message)
    useEffect(() => {
        if (editingMessage) {
            const loadDecryptedEdit = async () => {
                try {
                    const key = getSessionKey(editingMessage.conversationId);
                    if (!key) return;

                    const decrypted = await decrypt(editingMessage.ciphertext, editingMessage.iv, editingMessage.tag, key);
                    const payload = JSON.parse(decrypted);

                    setText(payload.content || "");
                    setRetainedMedia(payload.media || []);
                    setOriginalReplyToId(payload.replyTo || null);

                    setTimeout(() => {
                        inputRef.current?.focus();
                        inputRef.current?.setSelectionRange(payload.content.length, payload.content.length);
                    }, 50);
                } catch {
                    console.error("Failed to decrypt message for editing");
                }
            };
            loadDecryptedEdit();
        } else {
            setText("");
            setRetainedMedia([]);
            setOriginalReplyToId(null);
        }
    }, [editingMessage, getSessionKey, inputRef]);

    // Handle Replying (Decrypt message for banner)
    useEffect(() => {
        if (replyingTo) {
            const loadReplyPreview = async () => {
                try {
                    const key = getSessionKey(replyingTo.message.conversationId);
                    if (!key) return;

                    const decrypted = await decrypt(replyingTo.message.ciphertext, replyingTo.message.iv, replyingTo.message.tag, key);
                    const payload = JSON.parse(decrypted);

                    setReplyPreviewText(payload.content || (payload.media?.length ? "Attached Media" : ""));
                    inputRef.current?.focus();
                } catch {
                    setReplyPreviewText("Encrypted message");
                }
            };
            loadReplyPreview();
        } else {
            setReplyPreviewText("");
        }
    }, [replyingTo, getSessionKey, inputRef]);

    // Generate File Previews securely
    useEffect(() => {
        const newPreviews = files.map(file => ({
            url: URL.createObjectURL(file),
            type: file.type.startsWith("video/") ? "video" as const : "image" as const
        }));

        setPreviews(newPreviews);
        return () => newPreviews.forEach(p => URL.revokeObjectURL(p.url));
    }, [files]);

    return {
        text, setText,
        files, setFiles,
        previews,
        retainedMedia, setRetainedMedia,
        replyPreviewText,
        originalReplyToId
    };
};
