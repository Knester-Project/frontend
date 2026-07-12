import { useEffect, useRef } from "react";

// Stores and Services
import { usePushStore } from "@/stores/push.store";
import { useNewNotSub } from "@/services/userMutations";

export const NotificationInitializer = ({ children }: { children: React.ReactNode }) => {

    const { initialize, refresh, subscription, initialized, lastSyncedEndpoint } = usePushStore();

    const { mutate: syncSubscription } = useNewNotSub();

    // Use a ref to immediately block duplicate calls before state updates
    const syncAttemptedRef = useRef<string | null>(null);

    useEffect(() => {
        initialize();
    }, [initialize]);

    useEffect(() => {
        const handleFocus = () => refresh();
        const handleVisibilityChange = () => { if (document.visibilityState === "visible") refresh(); };
        window.addEventListener("focus", handleFocus);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            window.removeEventListener("focus", handleFocus);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [refresh]);

    // Synchronization Logic
    useEffect(() => {
        if (!initialized || !subscription) return;

        // If successfully synced previously, stop.
        if (subscription.endpoint === lastSyncedEndpoint) return;

        // If we already fired a request for this endpoint during this mount, stop.
        if (subscription.endpoint === syncAttemptedRef.current) return;

        // Mark as attempted immediately to break the React Query loop
        syncAttemptedRef.current = subscription.endpoint;

        syncSubscription(subscription, {
            onSuccess: () => {
                usePushStore.setState({ lastSyncedEndpoint: subscription.endpoint });
                console.log("[Push Sync] Subscription synced with backend.");
            },
            onError: (error) => {
                console.error("[Push Sync] Failed to sync. Will retry on next app load.", error);
            }
        });

    }, [initialized, subscription, lastSyncedEndpoint, syncSubscription]);

    return <>{children}</>;
};