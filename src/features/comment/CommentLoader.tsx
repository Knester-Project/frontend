// UIs
import { Skeleton } from "@/components/ui/skeleton";

const CommentLoader = () => {
  return (
    <div className="bg-accent/10 shadow-sm mb-4 p-4 md:p-5 xl:p-6 border border-border/50 rounded-3xl animate-pulse">
      {/* Header Skeleton */}
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-x-2">
          {/* Avatar Circle */}
          <Skeleton className="bg-foreground/10 rounded-full size-10 md:size-12" />

          <div className="space-y-2">
            {/* Username */}
            <Skeleton className="bg-foreground/10 w-24 h-4" />
            {/* Date */}
            <Skeleton className="bg-foreground/5 w-16 h-3" />
          </div>
        </div>

        {/* Views Skeleton */}
        <Skeleton className="bg-foreground/5 rounded-lg w-12 h-5" />
      </header>

      {/* Content Skeleton */}
      <section className="space-y-2 mt-4">
        <Skeleton className="bg-foreground/10 w-full h-4" />
        <Skeleton className="bg-foreground/10 w-[90%] h-4" />
        <Skeleton className="bg-foreground/10 w-[40%] h-4" />
      </section>

      {/* Actions Skeleton */}
      <div className="flex items-center gap-2 mt-5">
        {/* Vibe Button */}
        <Skeleton className="bg-foreground/5 rounded-full w-16 h-8" />
        {/* Replies Button */}
        <Skeleton className="bg-foreground/5 rounded-full w-16 h-8" />
        {/* Report Button */}
        <Skeleton className="bg-foreground/5 rounded-full w-10 h-8" />
      </div>

      {/* View Replies Link */}
      <div className="mt-4">
        <Skeleton className="bg-foreground/5 w-32 h-4" />
      </div>
    </div>
  );
};

export default CommentLoader;