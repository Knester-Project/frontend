import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

// Stores, Utils, and Hooks
import { meStore } from "@/stores/me.store";
import { initSocket, getSocket } from "@/utils/socket";
import { useNotifications } from "@/Hooks/useSSE";
import { usePresence } from "@/Hooks/usePresence";
import { useChatSocket } from "@/Hooks/chats/useChatSocket";

// UIs
import Nav from "@/components/layouts/Nav";
import InstallBtn from "@/components/layouts/InstallBtn";
import { NOT_LIMIT } from "@/assets/constants";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {

    const queryClient = useQueryClient();
    const [isAuthReady, setIsAuthReady] = useState<boolean>(false);

    useNotifications(isAuthReady, { limit: NOT_LIMIT });
    usePresence(isAuthReady);

    // Chat Socket Hook
    useChatSocket(isAuthReady);

    // Initial Auth & Boot Sequence
    useEffect(() => {
        let mounted = true;

        const init = async () => {
            const user = await meStore.getState().ensureUser(queryClient);

            if (user && mounted) {
                initSocket(); // Creates the instance
                setIsAuthReady(true);
            }
        };

        init();

        return () => {
            mounted = false;
            const socket = getSocket();
            if (socket) socket.disconnect();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Tab Visibility Manager
    useEffect(() => {
        if (!isAuthReady) return;

        const handleVisibilityChange = () => {
            const socket = getSocket();
            if (!socket) return;

            if (document.visibilityState === "hidden") {
                // Pause the connection, but keep the instance and listeners alive
                socket.disconnect();
            } else if (document.visibilityState === "visible") {
                // Resume the connection
                socket.connect();

                if (socket.connected) {
                    socket.emit("presence:heartbeat");
                } else {
                    socket.once("connect", () => {
                        socket.emit("presence:heartbeat");
                    });
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [isAuthReady]);

    return (
        <div>
            <Nav />
            <InstallBtn />
            {children}
        </div>
    );
};

export default DashboardLayout;