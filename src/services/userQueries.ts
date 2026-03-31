import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

// API endpoints
import { checkUsername, fetchComments, fetchSafetyPosts } from "./api.services";


// Check UserName Details
export function useCheckUsername(username: string) {
    return useQuery({
        queryKey: ['checkedUsername'],
        queryFn: () => checkUsername(username),
        enabled: username.trim().length > 5,
    })
}

// Fetch Safety Posts
export const useSafetyPosts = (queries: SafetyQueries) => {
    return useInfiniteQuery({
        queryKey: ["safety-posts", queries],

        queryFn: ({ pageParam }) =>
            fetchSafetyPosts({
                ...queries,
                cursor: pageParam,
            }),

        initialPageParam: undefined,

        getNextPageParam: (lastPage) => {
            return lastPage.data.nextCursor ?? undefined;
        },
    });
};

// Fetch Comments for a Post
export const useComments = (commentQueries: CommentQueries, enabled: boolean) => {
    return useInfiniteQuery({
        queryKey: ["comments", commentQueries],

        queryFn: ({ pageParam }) =>
            fetchComments({
                ...commentQueries,
                ...(pageParam ?? {}),
            }),

        enabled,

        initialPageParam: {},

        getNextPageParam: (lastPage) => {
            return lastPage.data.nextCursor ?? undefined;
        },
    });
};