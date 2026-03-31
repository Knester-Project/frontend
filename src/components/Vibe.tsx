import { motion, AnimatePresence } from "framer-motion";

// Icons
import { Heart } from "iconsax-reactjs";

const Vibe = ({ handleToggle, userVibed, vibes }: { handleToggle: () => void, userVibed: boolean, vibes: number }) => {
    return (
        <motion.button onClick={handleToggle} whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }}
            animate={{ scale: userVibed ? [1, 1.1, 1] : 1 }} transition={{ duration: 0.3 }}
            className={`flex items-center gap-1 px-3 py-1 rounded-xl cursor-pointer backdrop-blur-md transition-colors duration-300
                bg-white/30 dark:bg-white/10 border border-white/20 dark:border-white/5 shadow-sm
                ${userVibed ? "text-vibe shadow-[0_0_15px_rgba(255,0,100,0.3)] bg-white/40 dark:bg-white/20"
                    : "text-gray-600 dark:text-gray-300 hover:text-vibe-active hover:bg-white/50 dark:hover:bg-white/15"}`}>
                        
            {/* Heart Animation */}
            <motion.div key={userVibed ? "vibed" : "not-vibed"} initial={{ scale: 0.8, rotate: -15, opacity: 0.5 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 12 }}>
                <Heart variant={userVibed ? "Bold" : "Outline"} className="size-5" />
            </motion.div>

            {/* Count Animation */}
            <div className="overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span key={vibes} initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -15, opacity: 0 }} transition={{ duration: 0.15 }}
                        className="block font-medium text-sm md:text-base xl:text-lg montserrat">
                        {vibes}
                    </motion.span>
                </AnimatePresence>
            </div>
        </motion.button>
    );
}

export default Vibe;