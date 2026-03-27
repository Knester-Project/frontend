import { useState } from "react";
import { MediaViewer } from "./MediaViewer";

const MAX_MEDIA = 4;

type MediaItem = {
    url: string;
    type: "image" | "video";
};

export const MediaGrid = ({ media }: { media: MediaItem[] }) => {

    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    if (!media?.length) return null;

    const visibleMedia = media.slice(0, MAX_MEDIA);
    const remaining = media.length - MAX_MEDIA;

    return (
        <>
            <div className="gap-2 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-4">
                {visibleMedia.map((item, i) => (
                    <div key={i} onClick={() => setActiveIndex(i)}
                        className="relative rounded-xl max-h-[300px] aspect-square lg:aspect-[4/3] overflow-hidden cursor-pointer">

                        {item.type === "image" ? (
                            <img src={item.url} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        ) : (
                            <video src={item.url} className="w-full h-full object-cover" muted />
                        )}

                        {/* Play indicator for video */}
                        {item.type === "video" && (
                            <div className="absolute inset-0 flex justify-center items-center bg-background/30">
                                ▶
                            </div>
                        )}

                        {/* +X Overlay */}
                        {i === MAX_MEDIA - 1 && remaining > 0 && (
                            <div className="absolute inset-0 flex justify-center items-center bg-background/60 font-bold">
                                +{remaining}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <MediaViewer media={media} activeIndex={activeIndex} setActiveIndex={setActiveIndex} onClose={() => setActiveIndex(null)} />
        </>
    );
};