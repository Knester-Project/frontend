import { motion } from "framer-motion";

// Utils, Enums
import { cn } from "@/lib/utils";
import { dateConverter } from "@/utils/format";
import { NOTIF_TYPES } from "@/enums";
import { TickCircle } from "iconsax-reactjs";

export default function NotificationBox({ notification }: { notification: InAppNotification }) {

    const config = NOTIF_TYPES[notification.type];
    const Icon = config.icon;
    const isUnread = !notification.isRead;

    // Functions
    const handleRead = () => {

    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
                "relative flex items-start gap-3 bg-card p-3.5 border rounded-2xl transition-all",
                isUnread ? "border-border shadow-sm" : "border-border/50 opacity-60"
            )}
        >
            {/* Color bar */}
            <div className={cn("top-3 bottom-3 left-0 absolute rounded-full w-1", config.bar)} />

            {/* Sender avatar / icon */}
            <div className="relative flex-shrink-0 ml-1.5">
                {notification.sender?.profile?.profilePicture ? (
                    <img
                        src={notification.sender.profile.profilePicture}
                        alt={notification.sender.username}
                        className="rounded-full w-11 h-11 object-cover"
                    />
                ) : (
                    <div className="flex justify-center items-center bg-muted rounded-full size-8 md:size-9 xl:size-10">
                        <span className="size-4 md:size-4.5 xl:size-5 text-foreground/70">
                            <Icon />
                        </span>
                    </div>
                )}
                <div className={cn("-right-1 -bottom-1 absolute flex justify-center items-center border-2 border-card rounded-full size-5 md:size-6 xl:size-7", config.accent)}>
                    <span className="size-2.5 md:size-3 xl:size-3.5">
                        <Icon />
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className={cn("px-2 py-0.5 border rounded-full font-bold text-[10px] uppercase tracking-wide", config.accent)}>
                        {config.label}
                    </span>
                    {isUnread && <span className="bg-primary rounded-full w-2 h-2 animate-pulse" />}
                </div>
                <p className="mt-1 text-[11px] md:text-xs xl:text-sm leading-snug">
                    <span className="font-semibold text-foreground">{notification.title}</span>{" "}
                    <span className="text-foreground/70">{notification.message}</span>
                </p>
                <p className="mt-1.5 text-[10px] text-foreground/70">
                    {dateConverter(notification.createdAt)}
                </p>
            </div>

            {/* Mark read */}
            {isUnread && (
                <button
                    onClick={handleRead}
                    className="flex-shrink-0 hover:bg-muted p-1.5 rounded-lg text-foreground/70 hover:text-foreground transition-colors"
                    aria-label="Mark as read"
                >
                    <TickCircle className="size-3 md:size-3.5 xl:size-4" />
                </button>
            )}
        </motion.div>
    );
}
