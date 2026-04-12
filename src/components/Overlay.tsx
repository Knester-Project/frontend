import { type ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type OverlayProps = {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    variant?: "center" | "bottom" | "fullscreen";
    showBackdrop?: boolean;
    closeOnOutsideClick?: boolean;
};

// Variants
const getVariantClass = (variant: OverlayProps["variant"]) => {
    switch (variant) {
        case "bottom":
            return "absolute bottom-0 w-full max-w-5xl mx-auto flex flex-col max-h-[90vh]";
        case "fullscreen":
            return "absolute inset-0 w-full h-full max-w-7xl mx-auto flex flex-col";
        default:
            return "relative w-full max-w-7xl mx-auto flex flex-col max-h-[calc(100vh-2rem)]";
    }
};

const getInitial = (variant: OverlayProps["variant"]) => {
    switch (variant) {
        case "bottom":
            return { y: "100%", opacity: 0 };
        case "fullscreen":
            return { opacity: 0 };
        default:
            return { scale: 0.95, opacity: 0 };
    }
};

const getAnimate = () => ({
    y: 0,
    scale: 1,
    opacity: 1,
});

const getExit = (variant: OverlayProps["variant"]) => {
    switch (variant) {
        case "bottom":
            return { y: "100%", opacity: 0 };
        case "fullscreen":
            return { opacity: 0 };
        default:
            return { scale: 0.95, opacity: 0 };
    }
};

export const Overlay = ({ open, onClose, children, variant = "center", showBackdrop = true, closeOnOutsideClick = true }: OverlayProps) => {

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (open) {
            window.addEventListener("keydown", handleKey);
            document.body.style.overflow = "hidden";
        }

        return () => {
            window.removeEventListener("keydown", handleKey);
            document.body.style.overflow = "unset";
        };
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <div className="z-50 fixed inset-0 flex justify-center items-center p-2">

                    {/* Backdrop */}
                    {showBackdrop && (
                        <motion.div
                            className="absolute inset-0 bg-background/40 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeOnOutsideClick ? onClose : undefined}
                        />
                    )}

                    {/* Content Wrapper */}
                    <motion.div
                        initial={getInitial(variant)}
                        animate={getAnimate()}
                        exit={getExit(variant)}
                        transition={{ duration: 0.2 }}
                        className={getVariantClass(variant)}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-card shadow-lg mx-auto p-4 md:p-6 xl:p-8 border border-border rounded-2xl w-full overflow-y-auto text-card-foreground hide-scrollbar">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};