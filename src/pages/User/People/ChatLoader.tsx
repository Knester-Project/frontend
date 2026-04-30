import { Skeleton } from "@/components/ui/skeleton";

export default function UserChatLoader() {
    return (
        <div className="relative bg-card py-4 border border-border/60 rounded-2xl overflow-hidden">
            {/* Avatar and Info Area */}
            <div className="relative flex flex-col items-center p-4 pb-3">
                <Skeleton className="rounded-2xl size-12 md:size-14 xl:size-16" />

                {/* Username Skeleton */}
                <Skeleton className="mt-3 rounded-md w-24 h-3 md:h-3.5 xl:h-4" />

                {/* Badges Skeleton (Simulating a couple of badges) */}
                <div className="flex flex-wrap justify-center gap-1 mt-2.5 w-full">
                    <Skeleton className="rounded-md w-14 h-[18px]" />
                    <Skeleton className="rounded-md w-12 h-[18px]" />
                </div>
            </div>

            {/* Chat CTA Button Skeleton */}
            <div className="mt-1 px-4 pb-4">
                <Skeleton className="rounded-xl w-full h-8" />
            </div>
        </div>
    );
}