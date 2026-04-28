import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { queryOptions } from '@tanstack/react-query';

// API endpoints
import { checkUsername, circlePosts, feed, fetchComments, fetchReplies, fetchSafetyPosts, getCurrentUser, getUserDetails, inviteUser, profilePosts, trendingPosts, trendingTags } from "./api.services";

// Stores
import { meStore } from "@/stores/me.store";


// Check UserName Details
export function useCheckUsername(username: string) {
    return useQuery({
        queryKey: ['checkedUsername'],
        queryFn: () => checkUsername(username),
        enabled: username.trim().length >= 3,
    })
}

// Fetch Safety Posts
export const useSafetyPosts = (queries: SafetyQueries) => {
    return useInfiniteQuery({
        queryKey: ["safety-posts", queries],
        refetchOnWindowFocus: false,
        maxPages: 5,

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
        refetchOnWindowFocus: false,
        maxPages: 5,

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

// Fetch Reply for a Comment or Reply
export const useReplies = (replyQueries: ReplyQueries, enabled: boolean) => {
    return useInfiniteQuery({
        queryKey: ["replies", replyQueries],
        refetchOnWindowFocus: false,
        maxPages: 5,

        queryFn: ({ pageParam }) =>
            fetchReplies({
                ...replyQueries,
                ...(pageParam ?? {}),
            }),
        enabled,
        initialPageParam: {},

        getNextPageParam: (lastPage) => {
            return lastPage.data.nextCursor ?? undefined;
        },
    });
};

// Fetch User Profile
export const userProfileOptions = (username: string) => {
    return queryOptions({
        queryKey: ["profile", username],
        queryFn: async () => {
            if (username === "me") {
                const data = await getCurrentUser();

                // Sync Zustand
                meStore.getState().setUser(data.data);

                return data;
            }

            return getUserDetails(username);
        },
        staleTime: 1000 * 60 * 5,
    });
};

// Fetch Referral Code
export const useReferralLink = (enabled: boolean) => {
    return useQuery({
        queryKey: ['userReferral'],
        queryFn: () => inviteUser(),
        enabled,
        staleTime: 8 * 60000, // 8 minutes
    })
}

// User Feed
export const useFeed = (feedQueries: CursorQueries) => {
    return useInfiniteQuery({
        queryKey: ["feed", feedQueries],
        refetchOnWindowFocus: false,
        maxPages: 5,

        queryFn: ({ pageParam }) => feed({ ...feedQueries, cursor: pageParam }),
        initialPageParam: undefined,

        getNextPageParam: (lastPage) => {
            return lastPage.data.nextCursor ?? undefined;
        },
    });
};

// Trending Tags
export const useTrendingTags = () => {
    return useQuery({
        queryKey: ['trendingTags'],
        queryFn: () => trendingTags(),
    })
}

// In-Circle Posts
export const useCirclePosts = (feedQueries: CursorQueries) => {
    return useInfiniteQuery({
        queryKey: ["in-circle", feedQueries],
        refetchOnWindowFocus: false,
        maxPages: 5,

        queryFn: ({ pageParam }) => circlePosts({ ...feedQueries, cursor: pageParam }),
        initialPageParam: undefined,

        getNextPageParam: (lastPage) => {
            return lastPage.data.nextCursor ?? undefined;
        },
    });
};

// Trending Posts
export const useTrendingPosts = (feedQueries: CursorQueries) => {
    return useInfiniteQuery({
        queryKey: ["trending", feedQueries],
        refetchOnWindowFocus: false,
        maxPages: 5,

        queryFn: ({ pageParam }) => trendingPosts({ ...feedQueries, cursor: pageParam }),
        initialPageParam: undefined,

        getNextPageParam: (lastPage) => {
            return lastPage.data.nextCursor ?? undefined;
        },
    });
};

// Profile Posts
export const useProfilePosts = (feedQueries: CursorQueries, username: string) => {
    return useInfiniteQuery({
        queryKey: ["trending", feedQueries],
        refetchOnWindowFocus: false,
        maxPages: 5,

        queryFn: ({ pageParam }) => profilePosts({ ...feedQueries, cursor: pageParam }, username),
        initialPageParam: undefined,

        getNextPageParam: (lastPage) => {
            return lastPage.data.nextCursor ?? undefined;
        },
    });
};
