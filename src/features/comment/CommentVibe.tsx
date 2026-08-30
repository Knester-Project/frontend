import { motion, AnimatePresence } from "framer-motion";

// Icons
import { Heart } from "iconsax-reactjs";

const CommentVibe = ({ handleToggle, userVibed, vibes }: { handleToggle: () => void, userVibed: boolean, vibes: number }) => {
    return (
        <motion.button onClick={handleToggle} whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }}
            animate={{ scale: userVibed ? [1, 1.1, 1] : 1 }} transition={{ duration: 0.3 }} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full 
                    backdrop-blur-md transition-all duration-200 cursor-pointer 
                    ${userVibed ? 'text-vibe bg-vibe/10' : 'bg-white/7 border border-border hover:bg-vibe-active/5 hover:border-vibe-active hover:text-vibe-active'} `}>

            <motion.div key={userVibed ? "vibed" : "not-vibed"} initial={{ scale: 0.8, rotate: -15, opacity: 0.5 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 12 }}>
                <Heart className="size-3 md:size-3.5 xl:size-4" variant={userVibed ? "Bold" : "Outline"} />
            </motion.div>

            <div className="overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span key={vibes} initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -15, opacity: 0 }} transition={{ duration: 0.15 }}
                        className="font-medium montserrat">
                        {vibes}
                    </motion.span>
                </AnimatePresence>
            </div>
        </motion.button>
    );
}

export default CommentVibe;