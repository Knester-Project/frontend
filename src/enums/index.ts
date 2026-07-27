// Advert Status
export const ADVERT_STATUS_META = {
    active: { label: "Active", color: "bg-green-500/10 text-green-600 border-green-500/20" },
    paused: { label: "Paused", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    sold_out: { label: "Sold Out", color: "bg-red-500/10 text-red-500 border-red-500/20" },
};

// In App Notification
export const NOTIF_TYPES: Record<string, {
    label: string;
    icon: string;
    accent: string;
    bar: string;
}> = {
    message: {
        label: "Message",
        icon: "✉️",
        accent: "bg-blue-500/10 text-blue-600 border-blue-500/20",
        bar: "bg-blue-500",
    },
    profile_lookup: {
        label: "Profile Visit",
        icon: "👀",
        accent: "bg-purple-500/10 text-purple-600 border-purple-500/20",
        bar: "bg-purple-500",
    },
    new_follower: {
        label: "New Follower",
        icon: "👋",
        accent: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        bar: "bg-emerald-500",
    },
    post_like: {
        label: "New Like",
        icon: "💞",
        accent: "bg-rose-500/10 text-rose-600 border-rose-500/20",
        bar: "bg-rose-500",
    },
    order_update: {
        label: "Marketplace",
        icon: "🛒",
        accent: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        bar: "bg-amber-500",
    },
    system_alert: {
        label: "Notification",
        icon: "🔔",
        accent: "bg-primary/10 text-primary border-primary/20",
        bar: "bg-primary",
    },
    new_referral: {
        label: "New Referral",
        icon: "🫸",
        accent: "bg-blue-500/10 text-blue-600 border-blue-500/20",
        bar: "bg-blue-500"
    }
};