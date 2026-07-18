import { useEffect } from "react";

// Utils
import { getSocket } from "@/utils/socket";

export function usePresence(isAuthReady: boolean) {
    useEffect(() => {
        if (!isAuthReady) return;

        const socket = getSocket();

        // Emit on Connection
        if (socket?.connected) {
            socket.emit("presence:heartbeat");
        }

        // Set up the recurring heartbeat
        const pingInterval = setInterval(() => {
            if (socket?.connected) {
                socket.emit("presence:heartbeat");
            }
        }, 30000);

        // Cleanup: Stop pinging if the component unmounts or socket disconnects
        return () => {
            clearInterval(pingInterval);
        };
    }, [isAuthReady]);
}