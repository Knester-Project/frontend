import { useEffect } from "react";

// Libs, Utils, Stores
import { db } from "@/lib/db";
import { getSocket } from "@/utils/socket";
import { parseRedisMessage } from "@/utils/format";
import { meStore } from "@/stores/me.store";
import { useTypingStore } from "@/stores/typing.store";
import { useChatUIStore } from "@/stores/chatUI.store";

export const useChatSocket = (isAuthReady: boolean) => {

    const { user } = meStore();
    const { addTypingUser, removeTypingUser } = useTypingStore();


    // Attach Listeners ONLY when ready
    useEffect(() => {

        // If auth isn't ready, do nothing.
        if (!isAuthReady || !user?._id) return;

        const socket = getSocket();

        // This should never hit, but it satisfies TypeScript
        if (!socket) {
            console.error("Socket was expected but not found.");
            return;
        }

        // --- HANDLERS ---

        // New Message
        const handleNewMessage = async (incomingMsg: RedisMessage) => {
            try {
                const existingMsg = await db.messages.get(incomingMsg.id);

                if (existingMsg) {
                    if (existingMsg.syncStatus !== "sent") {
                        await db.messages.update(incomingMsg.id, { syncStatus: "sent" });
                    }
                    return;
                }

                const localMessage = parseRedisMessage(incomingMsg);
                await db.messages.add(localMessage);

                const currentActiveId = useChatUIStore.getState().activeConversationId;

                if (currentActiveId === incomingMsg.conversationId) {
                    socket.emit("message:read", {
                        conversationId: incomingMsg.conversationId,
                        messageId: incomingMsg.id
                    });
                } else {
                    socket.emit("message:delivered", {
                        conversationId: incomingMsg.conversationId,
                        messageId: incomingMsg.id
                    });
                }
            } catch (error) {
                console.error("Error processing incoming socket message:", error);
            }
        };

        // Edit Message
        const handleEditMessage = async (data: { messageId: string, ciphertext: string, iv: string, tag: string }) => {
            try {
                const existingMsg = await db.messages.get(data.messageId);
                if (!existingMsg) return;

                await db.messages.update(data.messageId, {
                    ciphertext: data.ciphertext,
                    iv: data.iv,
                    tag: data.tag,
                    edited: true,
                    editedAt: Date.now()
                });
            } catch (error) {
                console.error("Error processing edited message:", error);
            }
        };

        // Delete Message
        const handleDeleteMessage = async (data: { messageId: string }) => {
            try {
                await db.messages.delete(data.messageId);
            } catch (error) {
                console.error("Error processing deleted message:", error);
            }
        };

        // Delivery Update
        const handleDeliveredUpdate = async (data: { messageId: string, userId: string }) => {
            const triggerMsg = await db.messages.get(data.messageId);
            if (!triggerMsg) return;

            // Find ALL messages sent by us, in this conversation, older than or equal to this message
            await db.messages
                .where('conversationId').equals(triggerMsg.conversationId)
                .and(msg =>
                    msg.senderId === user?._id &&
                    msg.createdAt <= triggerMsg.createdAt &&
                    msg.syncStatus === 'sent'
                )
                .modify({ syncStatus: 'delivered' });
        };

        // Read Update
        const handleReadUpdate = async (data: { messageId: string, userId: string }) => {
            const triggerMsg = await db.messages.get(data.messageId);
            if (!triggerMsg) return;

            // Find ALL messages sent by us, in this conversation, older than or equal to this message
            await db.messages
                .where('conversationId').equals(triggerMsg.conversationId)
                .and(msg =>
                    msg.senderId === user?._id &&
                    msg.createdAt <= triggerMsg.createdAt &&
                    msg.syncStatus !== 'read'
                )
                .modify({ syncStatus: 'read' });
        };

        // Typing Start
        const handleTypingStart = (data: { userId: string; conversationId: string }) => {
            if (data.userId !== user._id) {
                addTypingUser(data.conversationId, data.userId);
            }
        };

        // Typing Stop
        const handleTypingStop = (data: { userId: string; conversationId: string }) => {
            if (data.userId !== user._id) {
                removeTypingUser(data.conversationId, data.userId);
            }
        };

        // Handle Conversation Read
        const handleConversationRead = async (data: { userId: string, timestamp: number }) => {
            if (data.userId === user?._id) return;

            // Find all messages WE sent, that are older than the timestamp, and aren't marked read yet
            await db.messages
                .where('createdAt')
                .belowOrEqual(data.timestamp)
                .modify((msg) => {
                    if (msg.senderId === user?._id && msg.syncStatus !== 'read') {
                        msg.syncStatus = 'read';
                    }
                });
        };

        // --- ATTACH LISTENERS ---
        socket.on("message:new", handleNewMessage);
        socket.on("message:edited", handleEditMessage);
        socket.on("message:deleted", handleDeleteMessage);
        socket.on("message:delivered_update", handleDeliveredUpdate);
        socket.on("message:read_update", handleReadUpdate);
        socket.on("typing:start", handleTypingStart);
        socket.on("typing:stop", handleTypingStop);
        socket.on("conversation:read_update", handleConversationRead);

        // --- CLEANUP ---
        return () => {
            socket.off("message:new", handleNewMessage);
            socket.off("message:edited", handleEditMessage);
            socket.off("message:deleted", handleDeleteMessage);
            socket.off("message:delivered_update", handleDeliveredUpdate);
            socket.off("message:read_update", handleReadUpdate);
            socket.off("typing:start", handleTypingStart);
            socket.off("typing:stop", handleTypingStop);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthReady, user?._id]);
};