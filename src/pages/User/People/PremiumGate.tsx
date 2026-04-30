import { motion } from "framer-motion";

// Icons
import { Smile } from "lucide-react";

export default function PremiumGate() {
    return (
        <div className="flex justify-center items-center px-4 py-12">
            <motion.div initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                className="space-y-4 bg-card shadow-lg p-4 md:p-5 xl:p-6 border border-border rounded-2xl w-full max-w-md text-center">
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="flex justify-center items-center bg-primary/10 rounded-full size-12">
                        <Smile className="size-4 md:size-5 xl:size-6 text-primary" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="font-semibold text-sm md:text-base xl:text-lg">
                    This feature is for premium users
                </h2>

                {/* Description */}
                <p className="text-[11px] text-foreground/80 md:text-xs xl:text-sm">
                    Upgrade to unlock exclusive features and get the full experience.
                    You can still continue, but some functionality may be limited.
                </p>
            </motion.div >
        </div >
    );
}