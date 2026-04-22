import { motion } from "framer-motion";

// Utils
import { cn } from "@/lib/utils";

// UIs
import { Button } from "@/components/ui/button";

// Icons
import { AlertCircle, RefreshCcw } from "lucide-react";

// Define the props
export interface InviteErrorProps {
    title?: string;
    message?: string;
    onRetry: () => void;
}

export default function InviteError({
    title = "Something went wrong",
    message = "We couldn't load your invite details. Please check your connection and try again.",
    onRetry
}: InviteErrorProps) {
    return (
        <div className="my-6 px-4 md:px-6 xl:px-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                className={cn("relative flex flex-col justify-center items-center p-4 md:p-6 xl:p-8 border rounded-2xl overflow-hidden text-center transition-all",
                    "bg-gradient-to-b from-destructive/5 to-card border-destructive/20"
                )}>
                {/* Soft glowing background effect */}
                <div className="-top-8 -right-8 absolute bg-destructive/10 blur-3xl rounded-full size-24 md:size-28 xl:size-32 pointer-events-none" />

                {/* Error Icon */}
                <div className="flex justify-center items-center bg-destructive/10 mb-4 rounded-full ring-1 ring-destructive/20 size-8 md:size-10 xl:size-12">
                    <AlertCircle className="size-4 md:size-5 xl:size-6 text-destructive" />
                </div>

                {/* Text Content */}
                <h3 className="font-semibold text-[11px] md:text-xs xl:text-sm">
                    {title}
                </h3>
                <p className="mt-1.5 mb-6 max-w-[260px] text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
                    {message}
                </p>

                {/* Retry Button */}
                <Button onClick={onRetry} variant="outline" size="sm" className="gap-2 hover:bg-destructive/10 border-destructive/20 rounded-xl h-9 hover:text-destructive">
                    <RefreshCcw className="size-3.5" />
                    Try Again
                </Button>
            </motion.div>
        </div>
    );
}