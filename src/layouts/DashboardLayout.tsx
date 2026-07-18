import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

// Stores, Utils, and Hooks
import { meStore } from "@/stores/me.store";
import { initSocket, disconnectSocket } from "@/utils/socket";
import { useNotifications } from "@/Hooks/useSSE";
import { usePresence } from "@/Hooks/usePresence";

// UIs
import Nav from "@/components/Nav";
import InstallBtn from "@/components/InstallBtn";


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {

    const queryClient = useQueryClient();
    const [isAuthReady, setIsAuthReady] = useState(false);

    // Initialize the SSE pipe
    useNotifications(isAuthReady);

    // Initialize the Presence Heartbeat
    usePresence(isAuthReady)

    // Initial Auth & Boot Sequence
    useEffect(() => {
        let mounted = true;

        const init = async () => {
            const user = await meStore.getState().ensureUser(queryClient);

            if (user && mounted) {
                initSocket();
                setIsAuthReady(true);
            }
        };

        init();

        return () => {
            mounted = false;
            disconnectSocket();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Tab Visibility Manager (Battery & Server Saver)
    useEffect(() => {
        if (!isAuthReady) return;

        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                disconnectSocket();
            } else if (document.visibilityState === "visible") {
                initSocket();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [isAuthReady]);

    return (
        <div className="min-h-dvh">
            <Nav />
            <InstallBtn />
            {children}
        </div>
    );
};

export default DashboardLayout;