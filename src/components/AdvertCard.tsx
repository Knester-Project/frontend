import { motion } from "framer-motion";

// Utils
import { cn } from "@/lib/utils";
import { formatAmount } from "@/utils/format";

// Icons
import { Tag, Wrench, Pencil, Image } from "lucide-react";

const STATUS_META = {
    active: { label: "Active", color: "bg-green-500/10 text-green-600 border-green-500/20" },
    paused: { label: "Paused", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    sold_out: { label: "Sold Out", color: "bg-red-500/10   text-red-500   border-red-500/20" },
};

interface AdvertProps {
    advert: MyAdvert;
    stackIndex?: number;
    isTop?: boolean;
    isOwner: boolean;
}

export default function AdvertCard({ advert, stackIndex = 0, isTop = false, isOwner }: AdvertProps) {

    const status = STATUS_META[advert.status] ?? STATUS_META.active;
    const thumb = advert.mediaUrls?.[0];

    return (
        <motion.div
            // onClick={isTop ? undefined : onClick}
            className={cn(
                "absolute inset-0 border border-border/60 rounded-3xl overflow-hidden",
                "bg-card shadow-lg select-none",
                isTop ? "cursor-default" : "cursor-pointer"
            )}
            style={{
                transformOrigin: "bottom center", scale: 1 - stackIndex * 0.04,
                y: stackIndex * -10, zIndex: 10 - stackIndex,
            }}>

            {/* Thumbnail strip */}
            <div className="relative bg-muted h-36 overflow-hidden">
                {thumb ? (<img src={thumb} alt={advert.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="flex flex-col justify-center items-center gap-2 w-full h-full text-foreground/70">
                        <Image className="size-8" />
                        <span className="text-xs">No media</span>
                    </div>
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />

                {/* Status badge */}
                <span className={cn("top-3 right-3 absolute backdrop-blur-sm px-2.5 py-1 border rounded-full font-semibold text-[9px] md:text-[10px] xl:text-[11px]", status.color)}>
                    {status.label}
                </span>

                {/* Type badge */}
                <span className="top-3 left-3 absolute flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2.5 py-1 border border-border/40 rounded-full font-semibold text-[9px] text-foreground md:text-[10px] xl:text-[11px]">
                    {advert.type === "good" ? <Tag className="size-3" /> : <Wrench className="size-3" />}
                    {advert.type === "good" ? "Good" : "Service"}
                </span>
            </div>

            {/* Body */}
            <div className="space-y-3 px-5 pt-4 pb-5">
                <div>
                    <h3 className="font-bold text-foreground line-clamp-1 leading-snug">{advert.title}</h3>
                    <p className="mt-1 text-[10px] text-foreground/80 md:text-[11px] xl:text-xs line-clamp-2 leading-relaxed">{advert.description}</p>
                </div>

                {/* Categories */}
                {advert.categories?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {advert.categories.slice(0, 3).map((c: string) => (
                            <span key={c} className="bg-accent px-2 py-0.5 rounded-md font-medium text-[8px] md:text-[9px] xl:text-[10px] text-accent-foreground">{c}</span>
                        ))}
                        {advert.categories.length > 3 && (
                            <span className="bg-muted px-2 py-0.5 rounded-md font-medium text-[9px] text-muted-foreground md:text-[10px] xl:text-[11px]">+{advert.categories.length - 3}</span>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="flex justify-between items-center pt-1">
                    <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[11px] text-primary md:text-xs xl:text-sm montserrat">{formatAmount(advert.averagePrice)}</span>
                        <span className="text-[9px] text-foreground/80 md:text-[10px] xl:text-[11px]">avg</span>
                    </div>
                    {(isTop && isOwner) && (
                        <button onClick={(e) => { e.stopPropagation(); }}
                            className="flex items-center gap-1.5 hover:bg-accent/20 px-3 py-1.5 border border-border hover:border-border/80 rounded-xl font-medium text-[10px] text-foreground/70 md:text-[11px] hover:text-foreground xl:text-xs transition-all cursor-pointer">
                            <Pencil className="size-3" />
                            Edit
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}