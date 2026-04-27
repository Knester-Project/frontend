// UIs
import { Skeleton } from "@/components/ui/skeleton";

export default function PostLoader() {
    return (
        <div className="bg-card shadow-sm mb-4 border border-border/60 rounded-2xl overflow-hidden">
            <div className="p-4">
                {/* Author row */}
                <div className="flex justify-between items-start gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                        {/* Avatar */}
                        <Skeleton className="rounded-xl w-9 h-9 shrink-0" />

                        {/* Name and Time */}
                        <div className="space-y-2">
                            <Skeleton className="w-32 h-3.5" />
                            <Skeleton className="opacity-60 w-20 h-2.5" />
                        </div>
                    </div>

                    {/* More options button placeholder */}
                    <Skeleton className="rounded-lg w-7 h-7" />
                </div>

                {/* Text Content */}
                <div className="space-y-2 mb-4">
                    <Skeleton className="w-full h-3.5" />
                    <Skeleton className="w-[90%] h-3.5" />
                    <Skeleton className="w-[65%] h-3.5" />
                </div>

                {/* Media Grid Placeholder (Assuming a single aspect-video image) */}
                <Skeleton className="mb-4 rounded-xl w-full aspect-video" />

                {/* Hashtags Placeholder */}
                <div className="flex flex-wrap gap-2 mb-2">
                    <Skeleton className="rounded-md w-12 h-4" />
                    <Skeleton className="rounded-md w-16 h-4" />
                    <Skeleton className="rounded-md w-10 h-4" />
                </div>
            </div>

            {/* Action bar */}
            <div className="flex justify-between items-center bg-muted/20 px-4 py-3 border-border/30 border-t">
                {/* Left side actions (Vibe, Comment) */}
                <div className="flex items-center gap-4">
                    <Skeleton className="rounded-lg w-14 h-6" />
                    <Skeleton className="rounded-lg w-14 h-6" />
                </div>

                {/* Right side actions (Views, Share) */}
                <div className="flex items-center gap-4">
                    <Skeleton className="rounded-lg w-12 h-6" />
                    <Skeleton className="rounded-lg w-8 h-6" />
                </div>
            </div>
        </div>
    );
}