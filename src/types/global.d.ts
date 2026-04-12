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

// Location Update Store
declare type Coordinates = {
    longitude: number;
    latitude: number;
};

declare type StoredLocation = {
    coords: Coordinates;
    timestamp: number;
};