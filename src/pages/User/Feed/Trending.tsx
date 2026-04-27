import { Link } from "@tanstack/react-router";

// UIs
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Services
import { useTrendingTags } from "@/services/userQueries";

// Icons
import { Flame, X } from "lucide-react";
import { Hashtag } from "iconsax-reactjs";

type Tags = {
    tag: string;
    count: number;
    formattedCount: string;
};

const Trending = () => {

    const { data, isLoading, isError, refetch } = useTrendingTags();

    return (
        <Card className="p-4">
            <div className="flex items-center gap-2">
                <Flame className="size-5 text-primary animate-pulse" />
                <p className="font-semibold text-base">Trending Hashtags</p>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="space-y-1">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="space-y-2 px-3 py-1.5 rounded-xl animate-pulse">
                            <Skeleton className="w-32 h-3" />
                            <Skeleton className="w-20 h-2" />
                        </div>
                    ))}
                </div>
            )}

            {/* Error State */}
            {isError && (
                <div className="flex items-center gap-3 bg-accent/10 shadow-lg mx-auto px-5 py-2.5 border border-accent/20 rounded-xl w-full">
                    <X className="size-6 text-destructive shrink-0" />
                    <span className="flex-1 font-medium text-xs">
                        Something went wrong, click retry
                    </span>
                    <button onClick={() => refetch()} className="bg-primary hover:bg-primary/90 px-3 py-1 rounded-xl font-semibold text-primary-foreground text-xs transition-colors cursor-pointer">
                        RETRY
                    </button>
                </div>
            )}

            {/* Data */}
            {!isLoading && !isError && (
                <section className="space-y-1">
                    {data?.data?.length === 0 ? (
                        <div className="flex flex-col justify-center items-center py-2 text-gray-600 dark:text-gray-300 text-center">
                            <Hashtag className="mb-2 size-6 text-primary" />
                            <p className="font-medium text-sm">
                                No trending hashtags yet
                            </p>
                            <p className="mt-1 text-xs">
                                Be the first to start a trend 🚀
                            </p>
                        </div>
                    ) : (
                        data?.data?.map((tag: Tags, index: number) => (
                            <Link to="/search" key={`tag_${index}`} className="group block hover:bg-accent/10 px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer">
                                <div className="flex justify-between items-center">
                                    <h3 className="flex items-center gap-1 font-semibold text-sm">
                                        <Hashtag className="size-4 text-primary" />
                                        {tag.tag}
                                    </h3>

                                    <span className="text-gray-400 group-hover:text-primary text-xs transition">
                                        #{index + 1}
                                    </span>
                                </div>

                                <p className="mt-1 text-gray-500 dark:text-gray-400 text-xs montserrat">
                                    {tag.formattedCount}
                                </p>
                            </Link>
                        ))
                    )}
                </section>
            )}
        </Card>
    );
};

export default Trending;