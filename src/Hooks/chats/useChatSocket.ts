import { useEffect } from "react";

// Libs, Utils, Stores
import { getSocket } from "@/utils/socket";
import { parseRedisMessage } from "@/utils/format";
import { meStore } from "@/stores/me.store";
import { useTypingStore } from "@/stores/typing.store";
import { useChatUIStore } from "@/stores/chatUI.store";
import * as DBServices from "@/utils/chat/local.storage";

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
                const existingMsg = await DBServices.getMessage(incomingMsg.id);

                // Message already exists locally.
                if (existingMsg) {
                    if (existingMsg.syncStatus !== "sent") {
                        await DBServices.updateMessageSyncStatus(
                            incomingMsg.id,
                            "sent"
                        );
                    }
                    return;
                }

                // Convert Redis message into our Dexie format and Save.
                const localMessage = parseRedisMessage(incomingMsg);
                await DBServices.saveIncomingMessage(localMessage);
                const isSys = localMessage.isSystem === true || incomingMsg.senderId === "system";

                // If it is not a system message emit
                if (!isSys) {
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
                }
            } catch (error) {
                console.error("Error processing incoming socket message:", error);
            }
        };

        // Edit Message
        const handleEditMessage = async (data: { messageId: string; ciphertext: string; iv: string; tag: string }) => {
            try {
                await DBServices.updateEditedMessage(data.messageId, { ciphertext: data.ciphertext, iv: data.iv, tag: data.tag });
            } catch (error) {
                console.error("Error processing edited message:", error);
            }
        };

        // Delete Message
        const handleDeleteMessage = async (data: { messageId: string; }) => {
            try {
                await DBServices.deleteMessage(data.messageId);
            } catch (error) {
                console.error("Error processing deleted message:", error);
            }
        };

        // Delivery Update
        const handleDeliveredUpdate = async (data: { messageId: string; userId: string }) => {
            try {
                if (data.userId === user?._id) return;
                await DBServices.markMessagesAsDelivered(data.messageId, user?._id);
            } catch (error) {
                console.error("Error processing delivered update:", error);
            }
        };

        // Read Update
        const handleReadUpdate = async (data: { messageId: string; userId: string }) => {
            try {
                if (data.userId === user?._id) return;
                await DBServices.markMessagesAsRead(data.messageId, user?._id);
            } catch (error) {
                console.error("Error processing read update:", error);
            }
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
        const handleConversationRead = async (data: { userId: string; timestamp: number }) => {
            try {
                if (data.userId === user?._id) return;
                await DBServices.markConversationMessagesAsRead(data.timestamp, user?._id);
            } catch (error) {
                console.error("Error processing conversation read update:", error);
            }
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
            socket.off("conversation:read_update", handleConversationRead);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthReady, user?._id]);
};