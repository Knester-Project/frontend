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

// Safety Post
declare type SafetyPost = {
    _id: string;
    postId: string;
    fullName: string;
    createdAt: string;
    dateOfIncident: string;
    content: string;
    verified: boolean;
    vibes: number;
    views: number;
    flags: number;
    comments: number;
    hasVibed: boolean,
    hasFlagged: boolean,
    location: {
        street?: string;
        town?: string;
        city?: string;
        state?: string;
    };
    media: { url: string }[];
    socialMedia: {
        platform: string;
        username: string;
        profileLink: string;
    }[];
};