import { useState } from "react";
import { motion } from "framer-motion";

// Services
import { useFeed } from "@/services/userQueries";
import useInfiniteScroll from "@/Hooks/useInfiniteScroll";

// Utils
import { cn } from "@/lib/utils";

// UIs
import PostLoader from "./PostLoader";
import NoPostsFound from "@/components/NotFoundPost";
import PostCard from "./PostCard";

// Icons
import { Clock, Flame, Sparkles } from "lucide-react";

const TABS = [
    { id: "latest", label: "Latest", icon: Clock },
    { id: "trending", label: "Trending", icon: Flame },
    { id: "foryou", label: "For You", icon: Sparkles },
];

const Posts = () => {

    const [activeTab, setActiveTab] = useState("latest");

    const {
        data,
        fetchNextPage,
        isLoading,
        hasNextPage,
        isFetchingNextPage,
    } = useFeed({ limit: 20 });

    const loadMoreRef = useInfiniteScroll({
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    });

    if (isLoading) {
        <div className="space-y-4 mt-5">
            {Array.from({ length: 3 }).map((_, i) => (
                <PostLoader key={i} />
            ))}
        </div>
    }

    const posts = data?.pages.flatMap((page) => page.data.posts) ?? [];

    if (posts.length === 0) {
        return <NoPostsFound title="No Posts found"
            text="No posts available — Try different filters or create a new post." />
    }

    return (
        <main className="space-y-4 py-10">
            {/* Section header */}
            <div className="flex justify-between items-center">
                <h2 className="font-semibold text-[11px] md:text-xs xl:text-sm uppercase tracking-wide">Posts</h2>
                <div className="flex items-center gap-0.5 bg-muted p-0.5 rounded-xl">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium text-xs transition-all duration-200 cursor-pointer",
                                    activeTab === tab.id ? "" : "text-gray-200 dark:text-gray-600 hover:text-accent")}>
                                {activeTab === tab.id && (
                                    <motion.div layoutId="feed-tab-indicator" className="absolute inset-0 bg-accent shadow-sm rounded-xl"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                                )}
                                <Icon className="z-10 relative size-3.5" />
                                <span className="hidden sm:inline z-10 relative">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {posts.map((post, index) => (
                <PostCard key={post._id} post={post} index={index} />
            ))}

            {/* Loading next page */}
            {isFetchingNextPage && (
                <div className="space-y-4">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <PostLoader key={i} />
                    ))}
                </div>
            )}

            {/* No more data */}
            {!hasNextPage && posts.length > 0 && (
                <p className="py-4 text-primary text-center">
                    No more posts to show
                </p>
            )}

            {/* Intersection trigger */}
            <div ref={loadMoreRef} />
        </main>
    );
}

export default Posts;