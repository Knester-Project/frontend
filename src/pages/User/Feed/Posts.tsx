import { useState } from "react";
import { motion } from "framer-motion";

// Services and Stores
import { useFeed, useCirclePosts, useTrendingPosts } from "@/services/userQueries";
import useInfiniteScroll from "@/Hooks/useInfiniteScroll";
import { meStore } from "@/stores/me.store";

// Utils and Constants
import { cn } from "@/lib/utils";
import { POST_LIMIT } from "@/assets/constants";

// UIs
import PostLoader from "./PostLoader";
import NoPostsFound from "@/features/post/NotFoundPost";
import PostCard from "../../../features/post/PostCard";

// Icons
import { Clock, Flame, Sparkles } from "lucide-react";

const TABS = [
    { id: "latest", label: "Latest", icon: Clock },
    { id: "trending", label: "Trending", icon: Flame },
    { id: "foryou", label: "For You", icon: Sparkles },
];

const Posts = () => {

    const { user } = meStore();
    const [activeTab, setActiveTab] = useState("latest");

    const emptyText =
        activeTab === "latest"
            ? "No posts available — Try different filters or create a new post."
            : activeTab === "trending"
                ? "No trending posts yet — Try following more topics or creators."
                : "No posts found for you — Try refreshing or exploring new circles.";

    // Call all queries unconditionally (This obeys React Hook rules)
    // This pre-fetches the other tabs in the background, 
    // making tab-switching feel instantaneous for the user!
    const feedQuery = useFeed({ limit: POST_LIMIT });
    const trendingQuery = useTrendingPosts({ limit: POST_LIMIT });
    const circleQuery = useCirclePosts({ limit: POST_LIMIT });

    // Determine which query object is currently active
    const activeQuery =
        activeTab === "latest" ? feedQuery :
            activeTab === "trending" ? trendingQuery :
                circleQuery;

    // Extract the variables from the currently active query
    const {
        data,
        fetchNextPage,
        isLoading,
        hasNextPage,
        isFetchingNextPage,
    } = activeQuery;

    // Pass the active fetch function to your scroll hook
    const loadMoreRef = useInfiniteScroll({
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    });

    const pageParams = data?.pageParams;
    const posts: Post[] = data?.pages.flatMap((page) => page.data.posts) ?? [];

    return (
        <main className="space-y-4 py-10">
            {/* Section header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold uppercase tracking-wide smallText">
                    {activeTab === "foryou" ? "Your Circle" : activeTab} Posts
                </h2>
                <div className="flex items-center gap-0.5 p-1 border border-muted rounded-md">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={cn("relative flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs transition-all duration-200 cursor-pointer",
                                    activeTab === tab.id ? "text-primary-foreground" : "hover:text-primary")}>
                                {activeTab === tab.id && (
                                    <motion.div layoutId="feed-tab-indicator"
                                        className="absolute inset-0 bg-primary shadow-sm rounded-sm"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                                )}
                                <Icon className={cn("z-5 relative size-3.5", activeTab === tab.id ? "text-primary-foreground" : "")} />
                                <span className="hidden sm:inline z-5 relative">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {isLoading ? (
                <div className="space-y-4 mt-5">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <PostLoader key={i} />
                    ))}
                </div>
            ) : posts.length === 0 ? (
                <NoPostsFound
                    title="No Posts found"
                    text={emptyText}
                />
            ) : (
                <>
                    <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }} className="space-y-4">
                        {posts.map((post, index) => (
                            <PostCard isOwner={user?._id === post.user._id} key={post._id} post={post} index={index} />
                        ))}
                    </motion.div>

                    {/* Loading next page */}
                    {isFetchingNextPage && (
                        <div className="space-y-4">
                            {Array.from({ length: 2 }).map((_, i) => (
                                <PostLoader key={i} />
                            ))}
                        </div>
                    )}

                    {/* No more data */}
                    {!hasNextPage && posts.length > 0 && pageParams?.[0] !== undefined ? (
                        <p className="py-4 font-medium text-muted-foreground text-center smallText">
                            You've caught up on all posts!
                        </p>
                    ) : null}

                    {/* Intersection trigger */}
                    <div ref={loadMoreRef} className="w-full h-4" />
                </>
            )}
        </main>
    );
}

export default Posts;