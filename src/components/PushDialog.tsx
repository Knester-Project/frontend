import { useState, useEffect } from "react";
import { sileo } from "sileo";

// Stores
import { usePushStore } from "@/stores/push.store";

// UIs
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Icons
import { BellOff, WifiOff } from "lucide-react";
import { NotificationBing, Setting2 } from "iconsax-reactjs";

type NotificationDialogProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function NotificationDialog({ isOpen, onClose }: NotificationDialogProps) {

    const { permission, subscribe, isSubscribing, isSupported } = usePushStore();
    const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

    // Track online/offline status
    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    const handleSubscribe = async () => {
        try {
            await subscribe();
            onClose();
        } catch (error) {
            console.log("Handle Subscribe Failed", error);
            sileo.error({ title: "Setup Failed", description: "Couldn't enable notifications." });
        }
    };

    // Fallback if completely unsupported
    if (!isSupported) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {permission === "denied" ?
                            <BellOff className="size-4 md:size-4.5 xl:size-5 text-destructive" />
                            :
                            <NotificationBing className="size-4 md:size-4.5 xl:size-5 text-primary" />
                        }
                        Push Notifications
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center space-y-4 py-4 text-center">

                    {permission === "default" && (
                        <>
                            <DialogDescription className="text-foreground/80">
                                Never miss an important update. Enable notifications to stay instantly connected to your community and marketplace.
                            </DialogDescription>

                            {isOffline && (
                                <p className="flex items-center gap-1.5 mt-2 font-medium text-[11px] text-destructive md:text-xs xl:text-sm">
                                    <WifiOff className="size-4" /> You're currently offline.
                                </p>
                            )}

                            <Button
                                onClick={handleSubscribe}
                                disabled={isSubscribing || isOffline}
                                className="mt-4 w-full sm:w-auto"
                            >
                                {isSubscribing ? "Enabling..." : "Enable Notifications"}
                            </Button>
                        </>
                    )}

                    {/* Granted but lost subscription (e.g., cleared browser cache) */}
                    {permission === "granted" && (
                        <>
                            <DialogDescription className="text-foreground/80">
                                You've allowed notifications, but we need to re-sync your device to start sending them.
                            </DialogDescription>

                            {isOffline && (
                                <p className="flex items-center gap-1.5 mt-2 font-medium text-[11px] text-destructive md:text-xs xl:text-sm">
                                    <WifiOff className="size-4" /> Connect to the internet to finish.
                                </p>
                            )}

                            <Button
                                onClick={handleSubscribe}
                                disabled={isSubscribing || isOffline}
                                className="mt-4 w-full sm:w-auto"
                            >
                                {isSubscribing ? "Syncing..." : "Finish Setup"}
                            </Button>
                        </>
                    )}

                    {/* Denied (Hard blocked by user) */}
                    {permission === "denied" && (
                        <>
                            <DialogDescription className="pb-2 text-foreground/80 text-base">
                                Notifications are blocked by your browser. We cannot request permission again.
                            </DialogDescription>

                            <div className="bg-muted p-4 border border-border rounded-xl w-full text-sm text-left">
                                <p className="flex items-center gap-2 mb-2 font-semibold">
                                    <Setting2 className="size-4" /> How to unblock:
                                </p>
                                <ol className="space-y-1.5 ml-1 text-muted-foreground list-decimal list-inside">
                                    <li>Click the <strong>Lock icon</strong> in your URL bar.</li>
                                    <li>Open <strong>Site Settings</strong>.</li>
                                    <li>Find <strong>Notifications</strong>.</li>
                                    <li>Change the setting to <strong>Allow</strong>.</li>
                                    <li>Return here and refresh the page.</li>
                                </ol>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}