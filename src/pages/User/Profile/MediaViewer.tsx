import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sileo } from "sileo";

// Utils and Services
import { detectMediaType } from "@/utils/format";
import { useDeleteMedia } from "@/services/userMutations";

// Icons
import { CloseSquare, Trash, PlayCircle } from "iconsax-reactjs";
import { Rocket } from "lucide-react";

interface MediaViewerProps {
    src: string;
    alt?: string;
    isOwner?: boolean;
}

export default function MediaViewer({ src, alt = "User media", isOwner = false }: MediaViewerProps) {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const mediaType = detectMediaType(src);

    const deleteMedia = useDeleteMedia();
    const handleDelete = (url: string) => {

        const ok = confirm("Delete this media?");
        if (ok) {
            deleteMedia.mutate((url), {
                onSuccess: () => {
                    sileo.success({ title: "Media Deleted !!!", icon: <Rocket className="size-3.5" />, });
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onError: (error: any) => {
                    const message = error?.response?.data?.message || "Couldn't delete media now, kindly try again later.";
                    sileo.error(message);
                },
            })
        } else {
            sileo.error({ title: "You cancelled the deletion" })
        }
    };

    return (
        <>
            <motion.div layoutId={`media-${src}`} onClick={() => setIsExpanded(true)} whileHover={{ y: -4 }}
                className="group relative bg-muted border border-border rounded-xl w-full overflow-hidden cursor-pointer">
                {mediaType === "video" ? (
                    <div className="relative">
                        <video src={src} className="block w-full h-auto" />
                        <div className="absolute inset-0 flex justify-center items-center bg-background/20">
                            <PlayCircle size={32} variant="Bold" className="text-foreground/80" />
                        </div>
                    </div>
                ) : (
                    <img src={src || "/error.png"} onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        img.onerror = null;
                        img.src = "/error.png";
                    }} alt={alt} className="block w-full h-auto object-cover" />
                )}

                {isOwner && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(src);
                        }}
                        className="top-2 right-2 z-10 absolute bg-background/90 backdrop-blur-md p-1 rounded-sm text-destructive hover:scale-110 transition-all cursor-pointer">
                        <Trash className="size-3.5 md:size-4 xl:size-4.5" variant="Bold" />
                    </button>
                )}
            </motion.div>

            {/* ── Full Screen Lightbox ── */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="z-[50] fixed inset-0 flex justify-center items-center bg-background/95 backdrop-blur-lg p-4"
                        onClick={() => setIsExpanded(false)}>

                        <motion.button initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                            className="top-6 right-6 z-[60] absolute hover:text-destructive transition-colors cursor-pointer"
                            onClick={() => setIsExpanded(false)}>
                            <CloseSquare className="size-5 md:size-5.5 xl:size-6" variant="Bold" />
                        </motion.button>

                        {/* Main Media Content */}
                        <motion.div layoutId={`media-${src}`} className="relative flex justify-center items-center max-w-full max-h-full"
                            onClick={(e) => e.stopPropagation()}>
                            {mediaType === "video" ? (
                                <video src={src} controls autoPlay className="shadow-2xl rounded-lg max-w-[95vw] max-h-[85vh]" />
                            ) : (
                                <img src={src} alt={alt} className="shadow-2xl rounded-lg max-w-[95vw] max-h-[85vh] object-contain" />
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}