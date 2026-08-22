import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";

// Stores
import { useInstallStore } from "@/stores/install.store";

// UIs
import { Button } from "@/components/ui/button";

// Icons
import { AddCircle, Home2, ImportCurve, Share, TickCircle } from "iconsax-reactjs";

export function PwaInstallPrompt() {

    const { initialize, deferredPrompt, isInstalled, isIOS, isVisible, setVisible, setDeferredPrompt } = useInstallStore();

    useEffect(() => {
        initialize();
    }, [initialize]);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        await deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
            setDeferredPrompt(null);
        }
    };

    if (!isVisible) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="mx-auto p-4 w-full max-w-screen-2xl">
                {isInstalled ? (
                    <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-xl text-primary">
                            <TickCircle className="size-5 md:size-5.5 xl:size-6" />
                        </div>

                        <div>
                            <h3 className="font-semibold">
                                App Installed!
                            </h3>
                            <p className="mt-1 text-[11px] text-muted-foreground md:text-xs xl:text-sm">
                                You are already using the installed application.
                            </p>
                        </div>
                    </div>
                ) : deferredPrompt ? (
                    <main className="py-10">
                        <header>
                            <h1 className="font-bold text-lg sm:text-xl md:text-2xl xl:text-3xl">
                                Experience Knester Web Like an App.
                            </h1>
                            <p className="mt-2 text-muted-foreground">
                                Install Knester's PWA for faster access, offline capabilities, and a seamless desktop/android and or iOS experience. It's lightweight, secure, and always ready.
                            </p>
                        </header>

                        <div className="flex items-start gap-3 mt-10 p-2 md:p-4 xl:p-6 border border-primary/10 rounded-2xl">
                            <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                <ImportCurve className="size-5 md:size-5.5 xl:size-6" />
                            </div>

                            <div className="flex-1">
                                <h3 className="font-semibold">
                                    Install App
                                </h3>

                                <p className="mt-1 text-[11px] text-muted-foreground md:text-xs xl:text-sm">
                                    Install the application for a faster,
                                    full-screen experience.
                                </p>

                                <Button className="mt-3 w-full" onClick={handleInstallClick}>
                                    Install Now
                                </Button>
                            </div>
                        </div>

                        <Link to="/feed">
                            <Button onClick={() => setVisible(false)} className="bg-destructive/70 hover:bg-destructive mt-10 w-full text-destructive-foreground duration-300">
                                Go To Feed <Home2 className="size-4 md:size-4.5 xl:size-5" />
                            </Button>
                        </Link>
                    </main>
                ) : isIOS ? (
                    <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-xl text-primary">
                            <ImportCurve className="size-5 md:size-5.5 xl:size-6" />
                        </div>

                        <div>
                            <h3 className="font-semibold">
                                Install App on iPhone
                            </h3>

                            <p className="mt-1 mb-3 text-[11px] text-muted-foreground md:text-xs xl:text-sm">
                                Install the app for the best experience.
                            </p>

                            <div className="space-y-2 bg-muted p-3 border border-border rounded-lg smallText">
                                <p className="flex items-center gap-2">
                                    <Share className="size-4 md:size-4.5 xl:size-5 text-blue-500" />
                                    Tap the Share button.
                                </p>

                                <p className="flex items-center gap-2">
                                    <AddCircle className="size-4 md:size-4.5 xl:size-5" />
                                    Choose <strong>Add to Home Screen</strong>.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : null}
            </motion.div>
        </AnimatePresence>
    );
}