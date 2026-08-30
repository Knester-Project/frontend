import { motion } from "framer-motion";
import { sileo } from "sileo";

// Services
import { useDeleteNotification, useMarkNot } from "@/services/userMutations";

// Utils
import { cn } from "@/lib/utils";
import { dateConverter } from "@/utils/format";
import { NOTIF_TYPES } from "@/enums";
import { buildNotificationUrl } from "@/utils/generate";

// Icons
import { TickCircle, Trash } from "iconsax-reactjs";

// Constants
import { NOT_LIMIT } from "@/assets/constants";

const URL = import.meta.env.VITE_URL;

export default function NotificationBox({ notification, nextCursor }: { notification: InAppNotification; nextCursor: string | null }) {

    const config = NOTIF_TYPES[notification.type];
    const Icon = config.icon;
    const isUnread = !notification.isRead;

    const queries = {
        limit: NOT_LIMIT,
        ...(nextCursor ? { cursor: nextCursor } : {}),
    };

    const notificationUrl = `${URL}${buildNotificationUrl(
        notification.type,
        notification.entity,
        notification.sender?.username
    )}`;

    const hasSender = !!notification.sender;

    const senderUrl = hasSender
        ? `${URL}/profile?profile=${notification?.sender?.username}`
        : "";

    const mark = useMarkNot("notification", queries);
    const removeNotification = useDeleteNotification(
        "notification",
        queries
    );

    const handleNavigate = () => {
        window.location.href = notificationUrl;
    };

    const handleRead = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        mark.mutate(notification, {
            onSuccess: () => {
                sileo.success({
                    title: "Marked as read",
                });
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (error: any) => {
                sileo.error({
                    title: "Error",
                    description:
                        error?.response?.data?.message ??
                        "Couldn't update notifications now, kindly try again later.",
                });
            },
        });
    };

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {

        e.preventDefault();
        e.stopPropagation();

        removeNotification.mutate(notification, {
            onSuccess: () => {
                sileo.success({
                    title: "Notification deleted",
                });
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (error: any) => {
                sileo.error({
                    title: "Error",
                    description:
                        error?.response?.data?.message ??
                        "Couldn't delete the notification. Please try again later.",
                });
            },
        });
    };

    const avatar = notification.sender?.profile?.profilePicture ? (
        <img src={notification.sender.profile.profilePicture} alt={notification.sender.username}
            className="rounded-full size-10 md:size-11 xl:size-12 object-cover" />
    ) : (
        <div className="flex justify-center items-center bg-muted rounded-full size-10 md:size-11 xl:size-12">
            <span className="text-2xl">{Icon}</span>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            onClick={handleNavigate} role="link" tabIndex={0}
            className={cn(
                "relative flex items-start gap-3 bg-card p-3.5 border rounded-r-2xl transition-all cursor-pointer",
                isUnread ? "border-border shadow-sm" : "border-border/50 opacity-60")}>

            {/* Color bar */}
            <div className={cn("top-3 bottom-3 left-0 absolute rounded-full w-1", config.bar)} />

            {/* Sender */}
            <div className="relative flex-shrink-0 ml-1.5">
                {hasSender ? (
                    <a href={senderUrl} onClick={(e) => { e.stopPropagation() }}>
                        {avatar}
                    </a>
                ) : (
                    avatar
                )}

                <div className={cn(
                    "-right-1 -bottom-1 absolute flex justify-center items-center border-2 border-card rounded-full size-5 md:size-6 xl:size-7",
                    config.accent
                )}>
                    <span className="size-2.5 md:size-3 xl:size-3.5">
                        {Icon}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className={cn("px-2 py-0.5 border rounded-full font-bold text-[10px] uppercase tracking-wide", config.accent)}>
                        {config.label}
                    </span>

                    {isUnread && (
                        <span className="bg-primary rounded-full size-2 animate-pulse" />
                    )}
                </div>

                <p className="mt-1 leading-snug smallText">
                    <span className="font-semibold text-foreground">
                        {notification.title}
                    </span>{" "}
                    <span
                        className="text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: notification.message }}
                    />
                </p>
                <p className="mt-1.5 text-[10px] text-muted-foreground">
                    {dateConverter(notification.createdAt)}
                </p>
            </div>

            {/* Actions */}
            {isUnread ? (
                <button onClick={handleRead} aria-label="Mark as read"
                    className={cn("flex-shrink-0 p-1.5 rounded-lg transition-colors cursor-pointer", config.accent)}>
                    <TickCircle className="size-3 md:size-3.5 xl:size-4" />
                </button>
            ) : (
                <button onClick={handleDelete} aria-label="Delete notification"
                    className="flex-shrink-0 bg-destructive/50 hover:bg-destructive p-1.5 rounded-lg text-destructive-foreground transition-colors cursor-pointer">
                    <Trash className="size-3 md:size-3.5 xl:size-4" />
                </button>
            )}
        </motion.div>
    );
}