import { motion } from "framer-motion";

export default function NotificationLoader() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="relative flex items-start gap-3 bg-card my-2 p-3.5 border border-primary/10 rounded-2xl">
            {/* Left color bar */}
            <div className="top-3 bottom-3 left-0 absolute bg-primary/10 rounded-full w-1" />

            {/* Avatar */}
            <div className="relative flex-shrink-0 ml-1.5">
                <div className="bg-primary/10 rounded-full size-11 animate-pulse" />

                {/* Notification icon */}
                <div className="-right-1 -bottom-1 absolute bg-primary/10 border-2 border-card rounded-full size-5 md:size-6 xl:size-7 animate-pulse" />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2 min-w-0">
                {/* Badge */}
                <div className="bg-primary/10 rounded-full w-16 h-5 animate-pulse" />

                {/* Title */}
                <div className="bg-primary/10 rounded w-3/4 h-3.5 animate-pulse" />

                {/* Message */}
                <div className="space-y-1">
                    <div className="bg-primary/10 rounded w-full h-3 animate-pulse" />
                    <div className="bg-primary/10 rounded w-2/3 h-3 animate-pulse" />
                </div>

                {/* Date */}
                <div className="bg-primary/10 rounded w-20 h-2.5 animate-pulse" />
            </div>

            {/* Read button */}
            <div className="bg-primary/10 rounded-lg w-7 h-7 animate-pulse" />
        </motion.div>
    );
}