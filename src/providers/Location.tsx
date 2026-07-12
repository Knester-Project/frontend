import { type ReactNode, useEffect } from "react";

// Store
import { useLocationStore } from "@/stores/location.store";

const SIX_HOURS = 6 * 60 * 60 * 1000;

export function LocationProvider({ children }: { children: ReactNode }) {

    const { initialized, initialize, permission, refreshLocation } = useLocationStore();

    // Initialize once.
    useEffect(() => {
        initialize();
    }, [initialize]);

    // Background refresh every 6 hours.
    useEffect(() => {
        if (!initialized) return;
        if (permission !== "granted") return;

        const interval = setInterval(() => {
            refreshLocation();
        }, SIX_HOURS);

        return () => clearInterval(interval);
    }, [initialized, permission, refreshLocation]);

    // Refresh whenever the user comes back to the application.
    useEffect(() => {
        if (!initialized) return;
        if (permission !== "granted") return;

        const handleVisibility = () => {
            if (document.visibilityState === "visible") {
                refreshLocation();
            }
        };

        document.addEventListener(
            "visibilitychange",
            handleVisibility
        );

        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibility
            );
        };
    }, [initialized, permission, refreshLocation]);

    // Refresh whenever the browser regains network connectivity.
    useEffect(() => {
        if (!initialized) return;
        if (permission !== "granted") return;

        const handleOnline = () => {
            refreshLocation();
        };

        window.addEventListener(
            "online",
            handleOnline
        );

        return () => {
            window.removeEventListener(
                "online",
                handleOnline
            );
        };
    }, [initialized, permission, refreshLocation]);

    return children;
}