import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";

// UIs
import { Button } from "@/components/ui/button";

// Icons
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Home, Refresh } from "iconsax-reactjs";

const defaults = {
    code: "500",
    title: "Something went wrong",
    description: "We encountered an unexpected error. Our team has been notified and is working on it.",
    showHomeButton: true,
    showBackButton: true,
    showRetryButton: true,
    homeRoute: "/",
    homeLabel: "Your Feed",
    backLabel: "Go Back",
    retryLabel: "Try Again",
    onRetry: () => window.location.reload(),
};

export default function ErrorPage(props = {}) {

    const config = { ...defaults, ...props };
    const navigate = useNavigate();

    const handleRetry = () => {
        if (config.onRetry) {
            config.onRetry();
        } else {
            window.location.reload();
        }
    };

    return (
        <div className="relative flex justify-center items-center px-4 py-12 min-h-[80vh] overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div className="-top-32 -right-32 absolute bg-primary/5 blur-3xl rounded-full w-96 h-96"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />

                <motion.div className="-bottom-24 -left-24 absolute bg-accent/10 blur-3xl rounded-full w-80 h-80"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
            </div>

            <div className="z-10 relative w-full max-w-lg text-center">
                {/* Error code with animated glitch */}
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="mb-4" >
                    <span className="font-montserrat font-extrabold text-primary/40 text-5xl md:text-6xl xl:text-7xl leading-none tracking-tighter select-none montserrat">
                        {config.code}
                    </span>
                </motion.div>

                {/* Icon */}
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} className="flex justify-center mb-6">
                    <div className="flex justify-center items-center bg-primary/10 rounded-xl size-10 md:size-12 xl:size-14">
                        <AlertTriangle className="size-5 md:size-6 xl:size-7 text-primary" strokeWidth={1.8} />
                    </div>
                </motion.div>

                {/* Title */}
                <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-3 font-montserrat font-bold text-foreground text-xl md:text-2xl xl:text-3xl tracking-tight">
                    {config.title}
                </motion.h1>

                {/* Description */}
                <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="mx-auto mb-10 max-w-md text-muted text-sm md:text-base xl:text-lg leading-relaxed">
                    {config.description}
                </motion.p>

                {/* Actions */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="flex sm:flex-row flex-col justify-center items-center gap-3">
                    {config.showRetryButton && (
                        <Button onClick={handleRetry}
                            className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:shadow-xl px-6 py-2.5 rounded-xl w-full sm:w-auto font-montserrat font-semibold text-primary-foreground transition-all duration-200">
                            <Refresh className="size-4" />
                            {config.retryLabel}
                        </Button>
                    )}
                    {config.showBackButton && (
                        <Button variant="outline" onClick={() => window.history.back()}
                            className="gap-2 hover:bg-accent/30 px-6 py-2.5 border-border rounded-xl w-full sm:w-auto font-montserrat font-medium transition-all duration-200">
                            <ArrowLeft className="size-4" />
                            {config.backLabel}
                        </Button>
                    )}
                    {config.showHomeButton && (
                        <Button variant="ghost" onClick={() => navigate({ to: "/feed" })}
                            className="gap-2 hover:bg-accent/20 px-6 py-2.5 rounded-xl w-full sm:w-auto font-montserrat font-medium text-muted hover:text-foreground transition-all duration-200">
                            <Home className="size-4" />
                            {config.homeLabel}
                        </Button>
                    )}
                </motion.div>

                {/* Separator line */}
                <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="mx-auto mt-12 bg-border w-24 h-px" />

                {/* Error reference */}
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.7 }}
                    className="mt-4 font-raleway text-[10px] text-muted/60 md:text-[11px] xl:text-xs">
                    Error {config.code} · If this persists, please contact support
                </motion.p>
            </div>
        </div>
    );
}