import { motion, AnimatePresence } from "framer-motion";

type MediaItem = {
    url: string;
    type: "image" | "video";
};

type Props = {
    media: MediaItem[];
    activeIndex: number | null;
    setActiveIndex: (index: number) => void;
    onClose: () => void;
};

export const MediaViewer = ({ media, activeIndex, setActiveIndex, onClose }: Props) => {

    if (activeIndex === null) return null;

    const current = media[activeIndex];

    const paginate = (direction: number) => {
        const nextIndex = activeIndex + direction;
        if (nextIndex >= 0 && nextIndex < media.length) {
            setActiveIndex(nextIndex);
        }
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div className="z-50 fixed inset-0 flex justify-center items-center bg-black/90"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                {/* Close */}
                <button onClick={onClose} className="top-4 right-4 z-50 absolute text-destructive text-xl cursor-pointer">
                    ✕
                </button>

                {/* Media Container */}
                <motion.div key={current.url} drag="x" dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_, info) => {
                        if (info.offset.x < -100) paginate(1);
                        if (info.offset.x > 100) paginate(-1);
                    }} initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 250, damping: 25 }}
                    className="flex justify-center items-center w-full h-full">

                    {current.type === "image" ? (
                        <motion.img
                            src={current.url}
                            className="shadow-2xl rounded-xl max-w-[90%] max-h-[80%] object-contain"
                            whileTap={{ scale: 1.5 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            style={{ touchAction: "none", cursor: "zoom-in" }}
                        />
                    ) : (
                        <video src={current.url} controls autoPlay className="rounded-xl max-w-[90%] max-h-[80%]" />
                    )}
                </motion.div>

                {/* Counter */}
                <div className="bottom-4 absolute text-white text-sm">
                    {activeIndex + 1} / {media.length}
                </div>

                {/* Navigation buttons (desktop fallback) */}
                {activeIndex > 0 && (
                    <button onClick={() => paginate(-1)} className="left-4 absolute text-white text-3xl">
                        ‹
                    </button>
                )}

                {activeIndex < media.length - 1 && (
                    <button onClick={() => paginate(1)} className="right-4 absolute text-white text-3xl" >
                        ›
                    </button>
                )}
            </motion.div>
        </AnimatePresence>
    );
};