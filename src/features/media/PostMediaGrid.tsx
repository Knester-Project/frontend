import { useState } from "react";

// UIs
import { MediaViewer } from "./MediaViewer";

// Icons
import { Play } from "iconsax-reactjs";

type MediaItem = {
    url: string;
    type: "image" | "video";
};

interface PostMediaGridProps {
    media: MediaItem[];
}

const PostMediaGrid = ({ media }: PostMediaGridProps) => {

    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    if (!media?.length) return null;
    const count = media.length;

    return (
        <>
            <div className="mb-4 w-full overflow-hidden">
                <div className={`flex w-full gap-2 ${count >= 3
                    ? "overflow-x-auto overscroll-x-contain snap-x snap-mandatory hide-scrollbar" : "overflow-hidden"}  `}>
                    {media.map((item, index) => {
                        const itemClass = count === 1 ? "w-full aspect-[16/10]" : count === 2
                            ? "w-[calc(50%-4px)] aspect-square" : "w-[72%] sm:w-[48%] md:w-[32%] max-w-[280px] aspect-square";

                        return (
                            <div key={`${item.url}-${index}`} onClick={() => setActiveIndex(index)}
                                className={`${itemClass} relative shrink-0 overflow-hidden rounded-xl cursor-pointer bg-background snap-start`}>
                                {item.type === "image" ? (
                                    <img src={item.url || "/error.png"} onError={(e) => {
                                        const img = e.currentTarget;
                                        img.onerror = null;
                                        img.src = "/error.png";
                                    }}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        alt="Post media"
                                        loading="lazy" />
                                ) : (
                                    <video src={item.url} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                                )}
                                {item.type === "video" && (
                                    <div className="absolute inset-0 flex justify-center items-center">
                                        <div className="flex justify-center items-center bg-background/70 rounded-full size-8 md:size-9 xl:size-10">
                                            <Play className="size-4 md:size-4.5 xl:size-5 text-accent" variant="Bold" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div >

            <MediaViewer media={media} activeIndex={activeIndex} setActiveIndex={setActiveIndex} onClose={() => setActiveIndex(null)} />
        </>
    );
};

export default PostMediaGrid;