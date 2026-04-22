import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { queryOptions } from '@tanstack/react-query';

// API endpoints
import { checkUsername, fetchComments, fetchReplies, fetchSafetyPosts, getCurrentUser, getUserDetails, inviteUser } from "./api.services";


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
        queryKey: ['profile', username],
        queryFn: () => (username === "me" ? getCurrentUser() : getUserDetails(username)),
        staleTime: 1000 * 60 * 5,
    });
}

// Fetch Referral Code
export const useReferralLink = (enabled: boolean) => {
    return useQuery({
        queryKey: ['userReferral'],
        queryFn: () => inviteUser(),
        enabled,
    })
}