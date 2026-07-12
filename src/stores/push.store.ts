import { create } from "zustand";

// Utils
import { supportsPushNotifications, getSubscription } from "@/utils/push";
import { urlBase64ToUint8Array } from "@/utils/generate";

const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

const pushChannel = typeof BroadcastChannel !== "undefined"
    ? new BroadcastChannel("push_sync_channel")
    : null;

export const usePushStore = create<PushNotificationState>((set, get) => {

    if (pushChannel) {
        pushChannel.onmessage = (event) => {
            if (event.data.type === "REFRESH_STATE") {
                get().refresh();
            }
        };
    }

    return {
        initialized: false,
        isSupported: supportsPushNotifications(),
        permission: "default",
        subscription: null,
        lastSyncedEndpoint: null,
        isChecking: false,
        isSubscribing: false,

        // Selectors / Computed properties
        get needsPermission() { return get().permission === "default"; },
        get needsSubscription() { return get().permission === "granted" && !get().subscription; },
        get isBlocked() { return get().permission === "denied"; },
        get shouldShowBell() {
            const state = get();
            return state.isSupported && state.permission !== "denied" && !state.subscription;
        },

        initialize: async () => {
            const { isSupported, refresh } = get();
            if (!isSupported) {
                set({ initialized: true });
                return;
            }
            await refresh();
            set({ initialized: true });
        },

        refresh: async () => {
            if (!get().isSupported) return;

            set({ isChecking: true });
            try {
                const currentPermission = Notification.permission as PushPermissionState;
                const currentSubscription = currentPermission === "granted"
                    ? await getSubscription()
                    : null;

                set({
                    permission: currentPermission,
                    subscription: currentSubscription
                });
            } catch (error) {
                console.error("Failed to refresh push state:", error);
            } finally {
                set({ isChecking: false });
            }
        },

        subscribe: async () => {
            const { isSupported } = get();
            if (!isSupported) return;

            set({ isSubscribing: true });
            try {
                // Request permission natively
                const permissionResult = await Notification.requestPermission();
                set({ permission: permissionResult as PushPermissionState });

                if (permissionResult !== "granted") {
                    set({ isSubscribing: false });
                    return;
                }

                // Duplicate Prevention
                let currentSub = await getSubscription();
                if (currentSub) {
                    set({ subscription: currentSub, isSubscribing: false });
                    return;
                }

                // Generate new subscription
                const registration = await navigator.serviceWorker.ready;
                const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
    
                currentSub = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertedVapidKey
                });

                set({ subscription: currentSub });

                // Tell other tabs to update their state
                pushChannel?.postMessage({ type: "REFRESH_STATE" });

            } catch (error) {
                console.error("Failed to subscribe to push manager:", error);
                throw error;
            } finally {
                set({ isSubscribing: false });
            }
        },

        unsubscribe: async () => {
            const { subscription } = get();
            if (!subscription) return;

            try {
                await subscription.unsubscribe();
                set({ subscription: null });
                pushChannel?.postMessage({ type: "REFRESH_STATE" });
            } catch (error) {
                console.error("Failed to unsubscribe:", error);
            }
        }
    };
});