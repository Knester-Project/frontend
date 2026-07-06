// Utils
import { cn } from "@/lib/utils";
import { detectMediaType } from "@/utils/format";

// Icons
import { Trash } from "iconsax-reactjs";

type DeletableMediaGridProps = {
    mediaUrls: string[];
    onDelete: (url: string) => void;
    disabled?: boolean;
    className?: string;
};

export default function MediaGridEditor({ mediaUrls, onDelete, disabled = false, className }: DeletableMediaGridProps) {

    if (!mediaUrls || mediaUrls.length === 0) return null;

    return (
        <div className={cn("gap-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4", className)}>
            {mediaUrls.map((url, index) => (
                <div
                    key={`${url}-${index}`}
                    className="group relative bg-muted border border-border rounded-2xl aspect-square overflow-hidden"
                >
                    {/* Media Render (Image or Video) */}
                    {detectMediaType(url) === "video" ? (
                        <video
                            src={url}
                            className="w-full h-full object-cover"
                            controls={false}
                            muted
                            playsInline
                        />
                    ) : (
                        <img
                            src={url}
                            alt={`Media ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                        />
                    )}

                    {/* Gradient Overlay for better icon visibility */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Delete Button */}
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => onDelete(url)}
                        className={cn(
                            "top-2 right-2 absolute p-2 rounded-md",
                            "bg-black/30 backdrop-blur-md text-white transition-all cursor-pointer shadow-sm",
                            "hover:bg-destructive hover:text-destructive-foreground hover:scale-105",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            "opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
                        )}
                        aria-label="Delete media"
                    >
                        <Trash className="size-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}