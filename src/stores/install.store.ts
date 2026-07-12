import { create } from "zustand";

interface InstallStore {
    deferredPrompt: BeforeInstallPromptEvent | null;
    isInstalled: boolean;
    isIOS: boolean;
    isVisible: boolean;

    setDeferredPrompt: (
        prompt: BeforeInstallPromptEvent | null
    ) => void;

    setInstalled: (installed: boolean) => void;
    setIOS: (ios: boolean) => void;
    setVisible: (visible: boolean) => void;
    initialize: () => void;
}

export const useInstallStore = create<InstallStore>((set, get) => ({
    deferredPrompt: null,
    isInstalled: false,
    isIOS: false,
    isVisible: false,

    setDeferredPrompt: (prompt) =>
        set({
            deferredPrompt: prompt,
            isVisible:
                get().isInstalled ||
                get().isIOS ||
                prompt !== null,
        }),

    setInstalled: (installed) =>
        set({
            isInstalled: installed,
            isVisible:
                installed ||
                get().isIOS ||
                get().deferredPrompt !== null,
        }),

    setIOS: (ios) =>
        set({
            isIOS: ios,
            isVisible:
                ios ||
                get().isInstalled ||
                get().deferredPrompt !== null,
        }),

    setVisible: (visible) =>
        set({
            isVisible: visible,
        }),

    initialize: () => {
        const isStandalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            (window.navigator as Navigator & { standalone?: boolean })
                .standalone === true;

        const isIOS = /iphone|ipad|ipod/i.test(
            navigator.userAgent
        );

        set({
            isInstalled: isStandalone,
            isIOS,
            isVisible:
                isStandalone ||
                isIOS ||
                get().deferredPrompt !== null,
        });
    },
}));