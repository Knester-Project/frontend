import { useState } from "react";
import { usePushStore } from "@/stores/push.store";
import { NotificationDialog } from "./PushDialog";

// Utils
import { cn } from "@/lib/utils";

// Icons
import { BellOff } from "lucide-react";
import { NotificationStatus } from "iconsax-reactjs";

export function NotificationBell() {

    const { isSupported, permission, subscription } = usePushStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // If the browser doesn't support push notifications, render absolutely nothing.
    if (!isSupported) return null;

    // The user is fully set up, remove the onboarding bell to save UI space.
    if (permission === "granted" && subscription !== null) return null;

    return (
        <>
            <button onClick={() => setIsDialogOpen(true)} aria-label="Setup push notifications"
                className="group relative hover:bg-accent/50 p-2 rounded-full transition-colors cursor-pointer"
            >
                {permission === "denied" ? (
                    <BellOff className="size-4 md:size-4.5 xl:size-5 text-muted-foreground" />
                ) : (
                    <>
                        <NotificationStatus className={cn("size-4 md:size-4.5 xl:size-5 text-foreground", "group-hover:animate-ping-once")} />

                        <span className="top-1.5 right-1.5 absolute flex size-2.5">
                            <span className="inline-flex absolute bg-destructive opacity-75 rounded-full w-full h-full animate-ping"></span>
                            <span className="inline-flex relative bg-destructive rounded-full size-2.5"></span>
                        </span>
                    </>
                )}
            </button>

            <NotificationDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
            />
        </>
    );
}