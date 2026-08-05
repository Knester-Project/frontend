import { useEffect } from "react";

// Libs, Utils, Stores
import { db } from "@/lib/db";
import { getSocket } from "@/utils/socket";
import { meStore } from "@/stores/me.store";
import { parseRedisMessage } from "@/utils/format";

export const useChatSocket = () => {
    
    const { user } = meStore();

    useEffect(() => {
        const socket = getSocket();
        
        // Ensure socket exists and user is authenticated
        if (!socket || !user?._id) return;

        const handleNewMessage = async (incomingMsg: RedisMessage) => {
            try {
                // DEDUPLICATION CHECK
                const existingMsg = await db.messages.get(incomingMsg.id);
                
                if (existingMsg) {
                    // Update to 'sent' if it hasn't been updated.
                    if (existingMsg.syncStatus !== "sent") {
                        await db.messages.update(incomingMsg.id, { syncStatus: "sent" });
                    }
                    return;
                }

                // PARSE REDIS DATA FOR LOCAL SAVINGS
                const localMessage = parseRedisMessage(incomingMsg);

                // SAVE LOCALLY (DEXIE)
                await db.messages.add(localMessage);

            } catch (error) {
                console.error("Error processing incoming socket message:", error);
            }
        };

        // Attach listeners
        socket.on("message:new", handleNewMessage);

        // Optional: Listen for other real-time events (like read receipts or typing)
        // socket.on("message:read", handleReadReceipt);
        // socket.on("typing:start", handleTyping);

        // Cleanup on unmount
        return () => {
            socket.off("message:new", handleNewMessage);
            // socket.off("message:read", handleReadReceipt);
        };
    }, [user?._id]); 
};