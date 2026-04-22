import { cn } from "@/lib/utils";

export default function InviteLoader() {
    return (
        <div className="my-6 px-4 sm:px-8">
            <div className={cn(
                "relative border rounded-2xl w-full overflow-hidden transition-all duration-300",
                "bg-gradient-to-br from-primary/5 via-card to-accent/10 border-border/40",
                "animate-pulse")}>
                <div className="relative flex items-center gap-4 px-5 py-4">
                    {/* Icon Box Skeleton */}
                    <div className="flex justify-center items-center bg-primary/10 rounded-xl size-11 shrink-0" />

                    {/* Text Area Skeletons */}
                    <div className="flex-1 space-y-2 text-left">
                        <div className="bg-muted rounded-md w-32 h-4" />
                        <div className="bg-muted rounded-md w-48 h-3" />
                    </div>

                    {/* Right-side Action Skeletons */}
                    <div className="flex items-center gap-1.5 opacity-60">
                        <div className="bg-muted rounded-full size-3.5" />
                        <div className="bg-muted rounded-md w-14 h-3" />
                    </div>
                </div>
            </div>
        </div>
    );
}