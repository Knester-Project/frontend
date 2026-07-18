import { useEffect } from "react";

// Utils
import { getSocket } from "@/utils/socket";

export function usePresence(isAuthReady: boolean) {
    useEffect(() => {
        if (!isAuthReady) return;

        // Initial Ping on Boot
        const initialSocket = getSocket();
        if (initialSocket?.connected) {
            initialSocket.emit("presence:heartbeat");
        }

        // The Recurring Heartbeat
        const pingInterval = setInterval(() => {
            // Grab the freshest socket
            const currentSocket = getSocket();

            if (currentSocket?.connected) {
                currentSocket.emit("presence:heartbeat");
            }
        }, 30000);

        // Cleanup
        return () => {
            clearInterval(pingInterval);
        };
    }, [isAuthReady]);
}