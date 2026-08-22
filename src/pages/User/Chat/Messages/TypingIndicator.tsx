import { motion } from "framer-motion";
import { cn } from "@/lib/utils";


export default function TypingIndicator({ profilePicture }: { profilePicture: string }) {

    return (
        <div className={cn("flex items-end gap-2 mb-4 px-3")}>

            <img src={profilePicture} className="flex-shrink-0 bg-muted mb-1 rounded-full size-5 md:size-5.5 xl:size-6" />
            <div className="bg-card shadow-sm px-4 py-3 border border-border rounded-2xl rounded-bl-sm">
                <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                        <motion.span
                            key={i}
                            className="block bg-primary/70 rounded-full size-2"
                            animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                            transition={{
                                duration: 0.9,
                                repeat: Infinity,
                                delay: i * 0.18,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}