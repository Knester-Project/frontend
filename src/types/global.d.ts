//Fancy Button
declare type FancyButtonProps = {
    text: string;
    loadingText?: string;
    icon?: React.ReactNode;
    onClick?: () => Promise<void> | void | string;
    variant?: "primary" | "secondary" | "success";
    size?: "sm" | "md" | "lg";
    disabled: boolean;
    loading: boolean;
}

//Validation Store
declare type ValidationStore = {
    referrer: string;
    setReferrer: (newReferrer: string) => void;
}