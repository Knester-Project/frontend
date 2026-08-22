import { useState } from "react";
import { sileo } from "sileo";

// Libs and Services
import { deleteMessageFn } from "@/services/api.services";
import { db } from "@/lib/db";

export const useDeleteMessage = () => {
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteMessage = async (message: Message) => {
        // Frontend 1-Hour Check
        const oneHourMs = 60 * 60 * 1000;
        if (Date.now() - message.createdAt > oneHourMs) {
            sileo.error({ title: "Delete window expired (more than 1 hour)" });
            return;
        }

        try {
            setIsDeleting(true);

            // Optimistic UI: Delete from Dexie immediately
            await db.messages.delete(message.id);

            // Call Backend
            await deleteMessageFn({
                messageId: message.id,
                conversationId: message.conversationId
            });

        } catch (error: unknown) {
            console.error("Failed to delete message:", error);
            const msg = error instanceof Error ? error.message : "Failed to delete message";
            sileo.error({ title: msg });

            // Rollback: If the API fails, put the message right back into Dexie
            await db.messages.add(message);
        } finally {
            setIsDeleting(false);
        }
    };

    return { deleteMessage, isDeleting };
};