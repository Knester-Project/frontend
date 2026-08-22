import { useState } from "react";
import { sileo } from "sileo";

// Libs, Services, Utils and Stores
import { db } from "@/lib/db";
import { editMessageFn } from "@/services/api.services";
import { encrypt } from "@/utils/chat/encrytion";
import { useCryptoStore } from "@/stores/crypto.store";
import { useChatUIStore } from "@/stores/chatUI.store";
import { usePresignedUpload } from "@/Hooks/usePresignedUpload";
import { makeFilesUnique } from "@/utils/format";


type EditPayload = {
    text: string;
    newFiles: File[];
    retainedMediaUrls: string[];
    replyTo: string | null;
};

export const useEditMessage = () => {

    const [isEditing, setIsEditing] = useState(false);

    const getSessionKey = useCryptoStore((state) => state.getSessionKey);
    const clearUIState = useChatUIStore((state) => state.clearUIState);
    const { uploadFiles } = usePresignedUpload();

    const editMessage = async (originalMessage: Message, payload: EditPayload) => {
        // 1-Hour Check (Saves a network request if already expired)
        const oneHourMs = 60 * 60 * 1000;
        if (Date.now() - originalMessage.createdAt > oneHourMs) {
            sileo.error({ title: "Edit window expired (more than 1 hour)" });
            clearUIState();
            return;
        }

        try {
            setIsEditing(true);
            let combinedMediaUrls = [...payload.retainedMediaUrls];

            // Upload NEW Media (if any)
            if (payload.newFiles && payload.newFiles.length > 0) {
                const uniqueFiles = makeFilesUnique(payload.newFiles);
                const uploads = await uploadFiles(uniqueFiles, "chat");

                const failedUpload = uploads.some(u => !u.publicUrl);
                if (failedUpload) throw new Error("Media upload failed");

                const newUrls = uploads.map(u => u.publicUrl as string);
                combinedMediaUrls = [...combinedMediaUrls, ...newUrls];
            }

            // Construct the Inner Payload
            const innerPayload = JSON.stringify({
                content: payload.text,
                media: combinedMediaUrls,
                replyTo: payload.replyTo
            });

            // Re-encrypt the payload
            const sessionKey = getSessionKey(originalMessage.conversationId);
            if (!sessionKey) throw new Error("Encryption key missing");

            const { ciphertext, iv, tag } = await encrypt(innerPayload, sessionKey);
            const editedAt = Date.now();

            // Optimistic Dexie Update
            await db.messages.update(originalMessage.id, {
                ciphertext,
                iv,
                tag,
                edited: true,
                editedAt
            });

            clearUIState();

            // API Call
            await editMessageFn({
                messageId: originalMessage.id,
                conversationId: originalMessage.conversationId,
                ciphertext,
                iv,
                tag
            });

        } catch (error: unknown) {

            console.error("Failed to edit message:", error);
            const responseMessage =
                typeof error === "object" && error !== null && "response" in error
                    ? (error.response as { data?: { message?: unknown } }).data?.message
                    : undefined;
            const msg =
                typeof responseMessage === "string"
                    ? responseMessage
                    : "Failed to edit message";
            sileo.error({ title: msg });

            // Revert Dexie to original state on failure
            await db.messages.update(originalMessage.id, {
                ciphertext: originalMessage.ciphertext,
                iv: originalMessage.iv,
                tag: originalMessage.tag,
                edited: originalMessage.edited,
                editedAt: originalMessage.editedAt
            });
        } finally {
            setIsEditing(false);
        }
    };

    return { editMessage, isEditing };
};