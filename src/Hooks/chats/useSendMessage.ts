import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { sileo } from "sileo";

// Lib, Utils, Store and Hooks
import { db } from "@/lib/db";
import { getSocket } from "@/utils/socket";
import { encrypt } from "@/utils/chat/encrytion";
import { makeFilesUnique } from "@/utils/format";
import { meStore } from "@/stores/me.store";
import { useCryptoStore } from "@/stores/crypto.store";
import { usePresignedUpload } from "@/Hooks/usePresignedUpload";

type SendMessageArgs = {
    conversationId: string | null;
    targetUserId?: string;
    text: string;
    files: File[];
    replyTo?: string;
};

type ServerPayload = {
    id: string;
    conversationId: string | null;
    isNew?: boolean;
    targetUserId?: string;
    ciphertext: string;
    iv: string;
    tag: string;
    syncStatus: 'pending';
};

export const useSendMessage = () => {

    const { user } = meStore();
    const { uploadFiles } = usePresignedUpload();
    const [isSending, setIsSending] = useState<boolean>(false);
    const getSessionKey = useCryptoStore((state) => state.getSessionKey);

    const sendMessage = async ({ conversationId, targetUserId, text, files, replyTo }: SendMessageArgs) => {

        const socket = getSocket();
        if (!socket) {
            console.error("Socket not connected");
            sileo.error({ title: "Something went wrong kindly restart" })
            return;
        }

        try {
            setIsSending(true);
            const messageId = uuidv4();
            let mediaUrls: string[] = [];

            // Upload Media
            if (files && files.length > 0) {
                const uniqueFiles = makeFilesUnique(files);
                const uploads = await uploadFiles(uniqueFiles, "chat");

                const failedUpload = uploads.some(u => !u.publicUrl);
                if (failedUpload) throw new Error("Media upload failed");

                mediaUrls = uploads.map(u => u.publicUrl as string);
            }

            // Construct Inner Payload
            const innerPayload = JSON.stringify({
                content: text,
                media: mediaUrls,
                replyTo: replyTo || null
            });

            // Get key using conversationId OR fallback to targetUserId for new chats
            const lookupKey = conversationId || targetUserId;
            if (!lookupKey) throw new Error("Missing routing ID for encryption.");

            const sessionKey = getSessionKey(lookupKey);
            if (!sessionKey) throw new Error("E2EE Session key missing for this chat.");

            const { ciphertext, iv, tag } = await encrypt(innerPayload, sessionKey);

            // Dexie Optimistic Update
            // If it's a new chat, we temporarily use targetUserId so the UI can render it.
            const localConvoId = conversationId || targetUserId;

            const localMessage = {
                id: messageId,
                conversationId: localConvoId || "",
                senderId: user?._id || "",
                ciphertext,
                iv,
                tag,
                edited: false,
                createdAt: Date.now(),
                syncStatus: "pending" as const,
                isSystem: false
            };

            await db.messages.add(localMessage);

            // Server Payload Construction
            const serverPayload: ServerPayload = {
                id: messageId,
                conversationId,
                targetUserId,
                isNew: !conversationId,
                ciphertext,
                iv,
                tag,
                syncStatus: "pending"
            };

            // Emit to Backend
            socket.emit("message:send", serverPayload, async (response: { success: boolean, messageId?: string, conversationId?: string, error?: string }) => {
                if (response.success && response.messageId) {

                    // If it was a new chat, update the Dexie database with the real conversationId
                    const finalConversationId = response.conversationId || localConvoId;

                    await db.messages.update(response.messageId, {
                        syncStatus: "sent",
                        conversationId: finalConversationId
                    });

                    // Update the CryptoStore to remap the session key to the new conversationId
                    if (!conversationId && response.conversationId) {
                        useCryptoStore.getState().setSessionKey(response.conversationId, sessionKey);
                    }
                } else {
                    console.error(response.error);
                    await db.messages.update(messageId, { syncStatus: "failed" });
                }
            });

        } catch (error) {
            console.error("Failed to send message:", error);
            sileo.error({ title: "Failed to send message" })
        } finally {
            setIsSending(false);
        }
    };

    return { sendMessage, isSending };
};