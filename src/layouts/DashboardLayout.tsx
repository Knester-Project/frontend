import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

// Stores and Utils
import { meStore } from "@/stores/me.store";
import { initSocket, disconnectSocket } from "@/utils/socket";

import Nav from "@/components/Nav";
import InstallBtn from "@/components/InstallBtn";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {

    const queryClient = useQueryClient();

    useEffect(() => {
        let mounted = true;

        const init = async () => {
            const user = await meStore.getState().ensureUser(queryClient);

            if (user && mounted) {
                initSocket();
            }
        };

        init();

        return () => {
            mounted = false;
            disconnectSocket();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-dvh">
            <Nav />
            <InstallBtn />
            {children}
        </div>
    );
};

export default DashboardLayout;