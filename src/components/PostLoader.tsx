// UIs
import { Skeleton } from "@/components/ui/skeleton";

const PostCardSkeleton = () => {
  return (
    <div className="bg-accent/20 dark:bg-accent/5 mb-4 p-4 md:p-5 xl:p-6 border border-border rounded-3xl">
      {/* Header Skeleton */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-1 items-start gap-3">
          <Skeleton className="rounded-full size-10 md:size-12" />
          <div className="flex-1 space-y-2">
            <Skeleton className="rounded-lg w-1/3 h-5" />
            <Skeleton className="rounded-lg w-1/4 h-3" />
          </div>
        </div>
        <Skeleton className="rounded-xl w-20 h-10" /> {/* Flag button skeleton */}
      </div>

      {/* Location/Date Row */}
      <div className="flex gap-3 mb-6">
        <Skeleton className="rounded-md w-32 h-4" />
        <Skeleton className="rounded-md w-24 h-4" />
      </div>

      {/* Content Skeleton */}
      <div className="space-y-2 mb-6">
        <Skeleton className="rounded-md w-full h-4" />
        <Skeleton className="rounded-md w-full h-4" />
        <Skeleton className="rounded-md w-2/3 h-4" />
      </div>

      {/* Media Grid Skeleton */}
      <div className="gap-2 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6">
        <Skeleton className="rounded-xl w-full aspect-square lg:aspect-[4/3]" />
        <Skeleton className="rounded-xl w-full aspect-square lg:aspect-[4/3]" />
      </div>

      {/* Footer Actions Skeleton */}
      <div className="flex justify-between items-center pt-3 border-border/50 border-t">
        <Skeleton className="rounded-xl w-20 h-10" /> {/* Vibe */}
        <Skeleton className="rounded-xl w-20 h-10" /> {/* Comment */}
        <Skeleton className="rounded-xl w-24 h-10" /> {/* Share */}
      </div>
    </div>
  );
};

export default PostCardSkeleton;