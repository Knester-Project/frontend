// Dexie Database
import { db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import type { Socket } from "socket.io-client";

export const useReadMessages = (conversationId: string) => {
    return useLiveQuery(() => conversationId.trim()
        ? db.messages.where('conversationId').equals(conversationId).sortBy('createdAt')
        : [],
        [conversationId]
    );
}

// Save Messages to Local Dexie DB
export const saveMessages = async (formattedForDexie: Message[]) => {
    await db.transaction('rw', db.messages, async () => {
        for (const incoming of formattedForDexie) {
            const existing = await db.messages.get(incoming.id);

            if (!existing) {
                // It's a new message from history, add it.
                await db.messages.add(incoming);
            } else {
                // It exists! Preserve the local syncStatus and edited fields
                // because the local socket listener is the source of truth for these.
                await db.messages.update(incoming.id, {
                    ciphertext: incoming.ciphertext,
                    iv: incoming.iv,
                    tag: incoming.tag,
                });
            }
        }
    });
}

// Mark All Messages as Read
export const updateReadStatus = (conversationId: string, userId: string, socket: Socket) => {

    if (!userId.trim() || !conversationId.trim()) return

    // Locally mark any unread messages we received previously as 'read'
    db.messages.where('conversationId').equals(conversationId).modify((msg) => {
        if (msg.senderId !== userId && msg.syncStatus !== 'read') {
            msg.syncStatus = 'read';

            // Tell the sender we read it
            socket.emit("message:read", { conversationId, messageId: msg.id });
        }
    });
}