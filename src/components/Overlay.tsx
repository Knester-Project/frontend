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

const getVariantClass = (variant: string) => {
    switch (variant) {
        case "bottom":
            return "absolute bottom-0 w-full max-w-md mx-auto";
        case "fullscreen":
            return "absolute inset-0 w-full h-full";
        default:
            return "relative w-full max-w-lg mx-auto";
    }
};

const getInitial = (variant: string) => {
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

const getExit = (variant: string) => {
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

    // ESC key close
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (open) window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <div className="z-50 fixed inset-0 flex justify-center items-center p-2">

                    {/* Backdrop */}
                    {showBackdrop && (
                        <motion.div className="absolute inset-0 bg-background/40 backdrop-blur-sm" initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeOnOutsideClick ? onClose : undefined} />
                    )}

                    {/* Content Wrapper */}
                    <motion.div initial={getInitial(variant)} animate={getAnimate()} exit={getExit(variant)}
                        transition={{ duration: 0.2 }} className={getVariantClass(variant)} onClick={(e) => e.stopPropagation()}>
                        <div className="bg-card shadow-lg p-4 md:p-6 xl:p-8 border rounded-2xl w-full max-w-7xl text-card-foreground">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};