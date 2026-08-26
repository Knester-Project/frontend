import { db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import type { Socket } from "socket.io-client";

// Utils
import { getTtlMs } from "../generate";


// READ MESSAGES
export const useReadMessages = (conversationId: string, messageTtl: number) => {
    return useLiveQuery(
        () => {
            if (!conversationId) return [];

            // Calculate the exact cutoff time for this render
            const expirationThreshold = Date.now() - getTtlMs(messageTtl);

            return db.messages
                .where('conversationId').equals(conversationId)
                // Filter out anything older than the threshold
                .filter(msg => msg.createdAt >= expirationThreshold)
                .sortBy('createdAt');
        },
        [conversationId, messageTtl]
    )
};


// GET MESSAGE
export const getMessage = async (messageId: string) => {
    if (!messageId.trim()) return undefined;
    return db.messages.get(messageId);
};


// SAVE INCOMING SOCKET MESSAGE
export const saveIncomingMessage = async (message: Message) => {
    const existingMessage = await db.messages.get(message.id);

    if (existingMessage) {
        return {
            existing: true,
            message: existingMessage,
        };
    }
    await db.messages.add(message);
    return {
        existing: false,
        message,
    };
};


// UPDATE MESSAGE SYNC STATUS
export const updateMessageSyncStatus = async (
    messageId: string,
    syncStatus: Message["syncStatus"]
) => {
    if (!messageId.trim()) return;

    await db.messages.update(messageId, {
        syncStatus,
    });
};


// EDIT MESSAGE
export const updateEditedMessage = async (messageId: string, data: { ciphertext: string; iv: string; tag: string; }) => {
    if (!messageId.trim()) return;

    const existingMessage = await db.messages.get(messageId);
    if (!existingMessage) return;

    await db.messages.update(messageId, {
        ciphertext: data.ciphertext,
        iv: data.iv,
        tag: data.tag,
        edited: true,
        editedAt: Date.now(),
    });
};


// DELETE MESSAGE
export const deleteMessage = async (messageId: string) => {
    if (!messageId.trim()) return;
    await db.messages.delete(messageId);
};


// MARK MESSAGES AS DELIVERED
export const markMessagesAsDelivered = async (messageId: string, userId: string) => {
    if (!messageId.trim() || !userId.trim()) return;

    const triggerMessage = await db.messages.get(messageId);
    if (!triggerMessage) return;

    await db.messages
        .where("conversationId")
        .equals(triggerMessage.conversationId)
        .and(
            (msg) =>
                msg.senderId === userId &&
                msg.createdAt <= triggerMessage.createdAt &&
                msg.syncStatus === "sent"
        )
        .modify({
            syncStatus: "delivered",
        });
};


// MARK MESSAGES AS READ
export const markMessagesAsRead = async (messageId: string, userId: string) => {
    if (!messageId.trim() || !userId.trim()) return;

    const triggerMessage = await db.messages.get(messageId);
    if (!triggerMessage) return;

    await db.messages
        .where("conversationId")
        .equals(triggerMessage.conversationId)
        .and(
            (msg) =>
                msg.senderId === userId &&
                msg.createdAt <= triggerMessage.createdAt &&
                msg.syncStatus !== "read"
        )
        .modify({
            syncStatus: "read",
        });
};


// MARK CONVERSATION AS READ
export const markConversationMessagesAsRead = async (timestamp: number, userId: string) => {
    if (!timestamp || !userId.trim()) return;

    await db.messages
        .where("createdAt")
        .belowOrEqual(timestamp)
        .modify((msg) => {
            if (
                msg.senderId === userId &&
                msg.syncStatus !== "read"
            ) {
                msg.syncStatus = "read";
            }
        });
};

// MARK CONVERSATION MESSAGES AS READ + NOTIFY SERVER
export const updateReadStatus = async (
    conversationId: string,
    userId: string,
    socket: Socket
) => {
    if (!userId.trim() || !conversationId.trim()) return;

    const messages = await db.messages
        .where("conversationId")
        .equals(conversationId)
        .toArray();

    const unreadMessages = messages.filter(
        (message) =>
            message.senderId !== userId &&
            message.syncStatus !== "read"
    );

    if (!unreadMessages.length) return;

    await db.transaction(
        "rw",
        db.messages,
        async () => {
            await db.messages
                .where("conversationId")
                .equals(conversationId)
                .modify((msg) => {
                    if (
                        msg.senderId !== userId &&
                        msg.syncStatus !== "read"
                    ) {
                        msg.syncStatus = "read";
                    }
                });
        }
    );

    // Notify the server after the local DB has been updated.
    for (const message of unreadMessages) {
        socket.emit("message:read", {
            conversationId,
            messageId: message.id,
        });
    }
};


// SAVE MESSAGE HISTORY
export const saveMessages = async (
    formattedForDexie: Message[]
) => {
    if (!formattedForDexie.length) return;

    await db.transaction(
        "rw",
        db.messages,
        async () => {
            for (const incoming of formattedForDexie) {
                const existing = await db.messages.get(
                    incoming.id
                );

                if (!existing) {
                    await db.messages.add(incoming);
                    continue;
                }

                // History should NOT overwrite local socket state.
                await db.messages.update(incoming.id, {
                    ciphertext: incoming.ciphertext,
                    iv: incoming.iv,
                    tag: incoming.tag,
                });
            }
        }
    );
};