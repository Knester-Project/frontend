import { motion } from "framer-motion";

// Icons
import { MessageText1 } from "iconsax-reactjs";


export default function EmptyConv() {
    return (
        <main className="flex flex-col justify-center items-center h-[80vh] text-center">
            <motion.div
                initial={{ scale: 0.85 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="relative"
            >
                <div className="relative flex justify-center items-center bg-gradient-to-br from-primary/20 to-primary/5 ring-border rounded-xl ring-1 size-16 md:size-18 xl:size-20">
                    <MessageText1 className="size-8 md:size-9 xl:size-10 text-primary" />
                </div>
            </motion.div>
            <p className="mt-6 font-bold text-base md:text-lg xl:text-xl">No conversations yet</p>
            <p className="mt-1.5 max-w-xs text-foreground/70 text-center">
                Start conversations with people in your circle. View all your messages in one place.
            </p>
        </main>
    );
}