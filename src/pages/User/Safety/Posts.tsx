import { useMemo } from "react";
import { Route } from "@/routes/_dashboard/safety";

// Services, Hooks and Constants
import { useSafetyPosts } from "@/services/userQueries";
import useInfiniteScroll from "@/Hooks/useInfiniteScroll";
import { POST_LIMIT } from "@/assets/constants";

// Components
import PostCard from "./PostCard";
import PostCardSkeleton from "../../../features/post/PostLoader";
import NoPostsFound from "@/features/post/NotFoundPost";

const Posts = () => {

    const { state, city, street, name } = Route.useSearch();

    const queries = useMemo(() => ({
        state,
        city,
        street,
        name,
        limit: POST_LIMIT,
    }), [state, city, street, name]);

    const {
        data,
        fetchNextPage,
        isLoading,
        hasNextPage,
        isFetchingNextPage,
    } = useSafetyPosts(queries);

    const loadMoreRef = useInfiniteScroll({
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    });

    if (isLoading) {
        return (
            <div className="space-y-4 mt-5">
                {Array.from({ length: 3 }).map((_, i) => (
                    <PostCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    const posts = data?.pages.flatMap((page) => page.data.data) ?? [];

    if (posts.length === 0) {
        return <NoPostsFound title="No Safety Post Found"
            text="It looks like there are no more safety posts. Be the first to report one or try adjusting your filters." />
    }

    return (
        <main className="space-y-4 mt-5">
            {posts.map((post) => (
                <PostCard key={post._id} post={post} />
            ))}

            {/* Loading next page */}
            {isFetchingNextPage && (
                <div className="space-y-4">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <PostCardSkeleton key={i} />
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
            <div ref={loadMoreRef} className="w-full h-4" />
        </main>
    );
};

export default Posts;