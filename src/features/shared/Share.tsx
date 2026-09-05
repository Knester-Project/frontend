import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sileo } from "sileo";

// Icons
import { Share } from "iconsax-reactjs";

const ShareMenu = ({ route, title, text }: { route: string; title: string; text: string }) => {

    const [open, setOpen] = useState<boolean>(false);
    const [origin, setOrigin] = useState<string>("");

    // Handle SSR safety for window object
    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    const shareUrl = `${origin}${route}`;
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(`${text} `);

    const handleShareClick = async () => {
        // If native share is available (mostly mobile), use it
        if (navigator.share) {
            try {
                await navigator.share({ title, text, url: shareUrl });
            } catch (err) {
                if ((err as Error).name !== "AbortError") {
                    console.error(err);
                    sileo.error({ title: "Can't share", description: "Something went wrong." });
                }
            }
        } else {
            // Otherwise, toggle our custom glass menu
            setOpen((prev) => !prev);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            sileo.success({ title: "Copied!", description: "Link saved to clipboard." });
            setOpen(false);
        } catch {
            sileo.error({ title: "Failed", description: "Could not copy link." });
        }
    };

    return (
        <div className="relative">
            {/* Trigger Button */}
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleShareClick}
                className={` flex items-center gap-2 px-3 py-1 rounded-xl cursor-pointer
                    backdrop-blur-md transition-all duration-300 shadow-sm bg-white/30 dark:bg-white/10 
                    border border-white/20 dark:border-white/5  hover:text-share-active hover:bg-white/40 dark:hover:bg-white/15 `}>

                <Share className="size-3.5 md:size-4 xl:size-5" />
                <span className="font-medium text-sm md:text-base xl:text-lg montserrat">Share</span>

            </motion.button>

            {/* Glass Fallback Menu */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="right-0 z-50 absolute bg-background/70 dark:bg-background/40 shadow-2xl backdrop-blur-xl mt-2 p-1.5 border border-border rounded-2xl w-52 overflow-hidden">
                        <div className="flex flex-col gap-1">
                            <ShareLink
                                href={`https://wa.me/?text=${encodedText}${encodedUrl}`}
                                label="WhatsApp"
                            />
                            <ShareLink
                                href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`}
                                label="X (Twitter)"
                            />
                            <button onClick={copyToClipboard}
                                className="hover:bg-accent/40 px-3 py-2 rounded-xl w-full text-left transition-colors cursor-pointer montserrat">
                                Copy Link
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Helper Component for Menu Items
const ShareLink = ({ href, label }: { href: string; label: string }) => (
    <a href={href} target="_blank" rel="noopener noreferrer"
        className="block hover:bg-accent/40 px-3 py-2 rounded-xl transition-colors montserrat">
        Share on {label}
    </a>
);

export default ShareMenu;