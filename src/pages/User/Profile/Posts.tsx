import { motion } from "framer-motion";

// Services and Hooks
import { useProfilePosts } from "@/services/userQueries";
import useInfiniteScroll from "@/Hooks/useInfiniteScroll";

// Constants
import { POST_LIMIT } from "@/assets/constants";

// UIs
import PostLoader from "../Feed/PostLoader";
import NoPostsFound from "@/features/post/NotFoundPost";
import PostCard from "../../../features/post/PostCard";



const Posts = ({ isOwner, username }: { isOwner: boolean, username: string }) => {

    const { data,
        fetchNextPage,
        isLoading,
        hasNextPage,
        isFetchingNextPage } = useProfilePosts({ limit: POST_LIMIT }, username);

    // Pass the active fetch function to your scroll hook
    const loadMoreRef = useInfiniteScroll({
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    });

    const posts = data?.pages.flatMap((page) => page.data.posts) ?? [];
    const nextCursor = data?.pages[0]?.data?.nextCursor || null;

    return (
        <main>
            {isLoading ? (
                <div className="gap-5 columns-1 md:columns-2 mt-5">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <PostLoader key={i} />
                    ))}
                </div>
            ) : posts.length === 0 ? (
                <NoPostsFound
                    title="No Posts found"
                    text="No Posts Yet, Kindly Check Back Later."
                />
            ) : (
                <>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }} className="gap-5 columns-1 md:columns-2">
                        {posts.map((post, index) => (
                            <PostCard key={post._id} post={post} index={index} nextCursor={nextCursor} isOwner={isOwner} />
                        ))}
                    </motion.div>

                    {/* Loading next page */}
                    {isFetchingNextPage && (
                        <div className="gap-5 columns-1 md:columns-2">
                            {Array.from({ length: 2 }).map((_, i) => (
                                <PostLoader key={i} />
                            ))}
                        </div>
                    )}

                    {/* No more data */}
                    {!hasNextPage && posts.length > 0 && (
                        <p className="py-4 font-medium text-foreground/80 text-xs text-center">
                            You've caught up on all posts!
                        </p>
                    )}

                    {/* Intersection trigger */}
                    <div ref={loadMoreRef} className="w-full h-4" />
                </>
            )}
        </main>
    );
}

export default Posts;