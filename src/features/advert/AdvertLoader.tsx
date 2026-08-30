// UIs
import { Skeleton } from "@/components/ui/skeleton";


export default function AdvertLoader() {
    return (
        <div>
            <Skeleton className="rounded-3xl w-full h-36" />
            {/* Body */}
            <div className="space-y-4 px-5 pt-4 pb-5">

                {/* Title & Description Skeleton */}
                <div className="space-y-2.5">
                    {/* Simulates the h3 Title */}
                    <Skeleton className="w-3/4 h-5" />

                    {/* Simulates the 2-line Description */}
                    <div className="space-y-1.5">
                        <Skeleton className="w-full h-2.5" />
                        <Skeleton className="w-4/5 h-2.5" />
                    </div>
                </div>

                {/* Categories Skeleton */}
                <div className="flex flex-wrap gap-1.5">
                    <Skeleton className="rounded-md w-12 h-4" />
                    <Skeleton className="rounded-md w-16 h-4" />
                    <Skeleton className="rounded-md w-10 h-4" />
                </div>

                {/* Footer Skeleton (Price & Optional Edit Button) */}
                <div className="flex justify-between items-center pt-2">
                    {/* Price area */}
                    <Skeleton className="w-20 h-4" />

                    {/* Edit button area */}
                    <Skeleton className="rounded-xl w-16 h-7" />
                </div>
            </div>
        </div>
    );
}