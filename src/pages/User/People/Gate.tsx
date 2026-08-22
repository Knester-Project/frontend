import { motion } from "framer-motion";

// Icons
import { GridLock, Unlock, ShieldTick, ArrowLeft3 } from "iconsax-reactjs";


export default function Gate() {

    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex flex-col items-center py-10 text-center">
            {/* Locked icon */}
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: "spring" }}
                className="relative flex justify-center items-center bg-amber-500/10 mb-6 rounded-3xl size-18 md:size-20 xl:size-22">
                <GridLock className="size-9 md:size-10 xl:size-11 text-amber-500" />
                <div className="-top-1.5 -right-1.5 absolute flex justify-center items-center bg-background border border-border rounded-full size-6 md:size-7 xl:size-8">
                    <ShieldTick className="size-3 md:size-3.5 xl:size-4 text-muted-foreground" />
                </div>
            </motion.div>

            {/* Heading */}
            <h2 className="font-bold text-lg md:text-xl xl:text-2xl">
                Your profile is locked
            </h2>
            <p className="mt-2 max-w-sm text-[11px] text-muted-foreground md:text-xs xl:text-sm leading-relaxed">
                People discovery is for members who make their profile visible to others. Keeping your
                profile locked means no one can find you — so it wouldn't be fair to browse
                everyone else while staying hidden.
            </p>

            {/* Card with explanation */}
            <div className="space-y-3 bg-card mt-6 p-4 border border-border rounded-2xl w-full max-w-sm text-left">
                <div className="flex items-start gap-2.5">
                    <span className="flex-shrink-0 bg-primary mt-0.5 rounded-full size-1.5" />
                    <p className="text-[10px] text-muted-foreground md:text-[11px] xl:text-xs leading-relaxed">
                        Unlocking makes your profile discoverable so others can find and connect with you.
                    </p>
                </div>
                <div className="flex items-start gap-2.5">
                    <span className="flex-shrink-0 bg-primary mt-0.5 rounded-full size-1.5" />
                    <p className="text-muted-foreground text-xs leading-relaxed">
                        You can re-lock your profile anytime from Settings if you change your mind.
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 mt-6 w-full max-w-sm smallText">
                <motion.a whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} href="/profile?profile=me"
                    className="flex justify-center items-center gap-2 bg-primary hover:bg-primary/90 shadow py-3 rounded-2xl w-full font-semibold text-primary-foreground transition-colors"
                >
                    <Unlock className="size-4 md:size-4.5 xl:size-5" />
                    Make me discoverable
                </motion.a>
                <button
                    onClick={() => window.history.back()}
                    className="flex justify-center items-center gap-1.5 py-2 w-full font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                    <ArrowLeft3 className="size-4 md:size-4.5 xl:size-5" />
                    Keep locked and go back
                </button>
            </div>
        </motion.div>
    );
}