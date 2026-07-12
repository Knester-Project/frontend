// Fancy Button
declare type FancyButtonProps = {
    text: string;
    loadingText?: string;
    icon?: React.ReactNode;
    onClick?: () => Promise<void> | void | string;
    variant?: "primary" | "secondary" | "success";
    size?: "sm" | "md" | "lg";
    disabled: boolean;
    loading: boolean;
    classNames?: string;
}

// Validation Store
declare type ValidationStore = {
    referrer: string;
    setReferrer: (newReferrer: string) => void;
}

type ToastVariant = "error" | "success";

// Error Inline
declare type ToastInline = {
    title?: string;
    message: string;
    variant?: ToastVariant;
    duration?: number; // in ms (default: 15000)
    handleClose: () => void;
};

// Location
declare type LocationPermission = PermissionState | "unsupported" | "unknown"
declare type LocationState = {
    permission: LocationPermission;
    coordinates: Coordinates | null;
    loading: boolean;
    initialized: boolean;
    lastUpdated: number | null;
}

declare type Coordinates = {
    longitude: number;
    latitude: number;
};

declare type StoredLocation = {
    coords: Coordinates;
    timestamp: number;
};

// Push Notifications
declare type PushPermissionState = "default" | "granted" | "denied";

declare interface PushNotificationState {
    initialized: boolean;
    isSupported: boolean;
    permission: PushPermissionState;
    subscription: PushSubscription | null;
    lastSyncedEndpoint: string | null;
    isChecking: boolean;
    isSubscribing: boolean;
    needsPermission: boolean;
    needsSubscription: boolean;
    isBlocked: boolean;
    shouldShowBell: boolean;
    initialize(): Promise<void>;
    refresh(): Promise<void>;
    subscribe(): Promise<void>;
    unsubscribe(): Promise<void>;
}

// Installation
interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{
        outcome: "accepted" | "dismissed";
        platform: string;
    }>;
}
