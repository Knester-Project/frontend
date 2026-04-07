import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileLoader() {
    return (
        <div className="space-y-6 mx-auto p-4 max-w-4xl">
            {/* Header Banner & Profile Section */}
            <div className="relative shadow-sm border border-border rounded-xl overflow-hidden">
                {/* Banner Skeleton */}
                <Skeleton className="rounded-none w-full h-32" />

                <div className="p-4 md:p-5 xl:p-6 pt-0">
                    {/* Avatar Skeleton */}
                    <div className="relative -mt-12 mb-4">
                        <Skeleton className="border-4 border-border rounded-2xl size-24" />
                    </div>

                    {/* Name and Tags */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-48 h-8" />
                            <Skeleton className="rounded-full w-20 h-6" />
                        </div>
                        <Skeleton className="w-64 h-4" />
                    </div>

                    {/* Action Buttons (Top Right) */}
                    <div className="top-4 right-4 absolute flex gap-2">
                        <Skeleton className="rounded-md w-32 h-9" />
                        <Skeleton className="rounded-md w-20 h-9" />
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="gap-4 grid grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="rounded-xl w-full h-24" />
                ))}
            </div>

            {/* About Me Section */}
            <div className="space-y-4 shadow-sm p-6 border border-border rounded-xl">
                <div className="flex justify-between items-center">
                    <div className="space-y-2">
                        <Skeleton className="w-24 h-6" />
                        <Skeleton className="w-40 h-3" />
                    </div>
                    <Skeleton className="size-5" />
                </div>

                {/* List Items */}
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="rounded-lg w-full h-12" />
                    ))}
                </div>
            </div>
        </div>
    )
}