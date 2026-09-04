import { useQuery, useInfiniteQuery, infiniteQueryOptions } from "@tanstack/react-query";
import { queryOptions } from '@tanstack/react-query';

// API endpoints
import * as Api from "./api.services";

// Stores
import { meStore } from "@/stores/me.store";


// Check UserName Details
export function useCheckUsername(username: string) {
    return useQuery({
        queryKey: ['checkedUsername', username],
        queryFn: () => Api.checkUsername(username),
        enabled: username.trim().length >= 2,
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: 'always',
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })
}


// Fetch Safety Posts
export const useSafetyPosts = (queries: SafetyQueries) => {
    return useInfiniteQuery({
        queryKey: ["safety-posts", { state: queries.state, city: queries.city, name: queries.name, street: queries.street, limit: queries.limit }],
        refetchOnWindowFocus: false,
        maxPages: 5,

        queryFn: ({ pageParam }) =>
            Api.fetchSafetyPosts({
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
        queryKey: ["comments", { postId: commentQueries.postId, limit: commentQueries.limit }],
        maxPages: 5,

        queryFn: ({ pageParam }) =>
            Api.fetchComments({
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
        queryKey: ["replies", { id: replyQueries.id, type: replyQueries.type, limit: replyQueries.limit }],
        maxPages: 5,

        queryFn: ({ pageParam }) =>
            Api.fetchReplies({
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
                const data = await Api.getCurrentUser();

                // Sync Zustand
                meStore.getState().setUser(data.data);

                return data;
            }

            return Api.getUserDetails(username);
        },
        staleTime: 1000 * 60 * 5,
    });
};

// Fetch Referral Code
export const useReferralLink = (enabled: boolean) => {
    return useQuery({
        queryKey: ['userReferral'],
        queryFn: () => Api.inviteUser(),
        enabled,
        staleTime: 8 * 60000, // 8 minutes
    })
}

// User Feed
export const useFeed = (feedQueries: CursorQueries) => {
    return useInfiniteQuery({
        queryKey: ["feed", { limit: feedQueries.limit }],
        maxPages: 5,

        queryFn: ({ pageParam }) => Api.feed({ ...feedQueries, cursor: pageParam }),
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
        queryFn: () => Api.trendingTags(),
    })
}

// In-Circle Posts
export const useCirclePosts = (feedQueries: CursorQueries) => {
    return useInfiniteQuery({
        queryKey: ["in-circle", { limit: feedQueries.limit }],
        maxPages: 5,

        queryFn: ({ pageParam }) => Api.circlePosts({ ...feedQueries, cursor: pageParam }),
        initialPageParam: undefined,

        getNextPageParam: (lastPage) => {
            return lastPage.data.nextCursor ?? undefined;
        },
    });
};

// Trending Posts
export const useTrendingPosts = (feedQueries: CursorQueries) => {
    return useInfiniteQuery({
        queryKey: ["trending", { limit: feedQueries.limit }],
        maxPages: 5,

        queryFn: ({ pageParam }) => Api.trendingPosts({ ...feedQueries, cursor: pageParam }),
        initialPageParam: undefined,

        getNextPageParam: (lastPage) => {
            return lastPage.data.nextCursor ?? undefined;
        },
    });
};

// Profile Posts
export const useProfilePosts = (feedQueries: CursorQueries, username: string) => {
    return useInfiniteQuery({
        queryKey: ["profile-posts", { limit: feedQueries.limit }],
        maxPages: 5,

        queryFn: ({ pageParam }) => Api.profilePosts({ ...feedQueries, cursor: pageParam }, username),
        initialPageParam: undefined,

        getNextPageParam: (lastPage) => {
            return lastPage.data.nextCursor ?? undefined;
        },
    });
};

// People Page Analytics
export const usePeoplePage = () => {
    return useQuery({
        queryKey: ['peopleAnalytics'],
        queryFn: () => Api.fetchPeopleAnalytics(),
    })
}

// Nearby People
export const useNearByPeople = (queries: PeopleQueries) => {
    return useInfiniteQuery({
        queryKey: ['nearby', {
            radiusKm: queries.radiusKm,
            state: queries.state,
            limit: queries.limit,
            premiumOnly: queries.premiumOnly,
            onlineOnly: queries.onlineOnly
        }],
        refetchOnWindowFocus: false,
        maxPages: 5,
        staleTime: 10 * 60000,

        queryFn: ({ pageParam }) => Api.fetchPeople({ ...queries, cursor: pageParam }),
        initialPageParam: undefined,

        getNextPageParam: (lastPage) => {
            return lastPage.data.nextCursor ?? undefined;
        },
    });
};

// Fetch My Adverts
export const useMyAdverts = () => {
    return useQuery({
        queryKey: ['myAdverts'],
        queryFn: () => Api.fetchMyAdvert(),
    })
}

// Fetch User Adverts
export const useUserAdverts = (username: string) => {
    return useQuery({
        queryKey: ['adverts', username],
        queryFn: () => Api.fetchUserAdvert(username),
    })
}

// Fetch Server Time
export const useServerTime = () => {
    return useQuery({
        queryKey: ['serverTime'],
        queryFn: () => Api.fetchTime(),
    });
}

// Fetch Notifications
export const useNotification = (queries: CursorQueries) => {
    return useInfiniteQuery({
        queryKey: ['notification', { limit: queries.limit }],
        maxPages: 5,

        queryFn: ({ pageParam }) => Api.fetchNotifications({ ...queries, cursor: pageParam }),
        initialPageParam: undefined,

        getNextPageParam: (lastPage) => {
            return lastPage.data.nextCursor ?? undefined;
        },
    });
};

// Fetch Notification Unread Count
export const useNotUnreadCount = () => {
    return useQuery({
        queryKey: ['notification-unread'],
        queryFn: () => Api.fetchNotUnreadCount(),
    });
}

// Fetch All Conversations
export const allConversationsOptions = () => infiniteQueryOptions({
    queryKey: ['conversations'],
    queryFn: async ({ pageParam = 0 }) => {
        return Api.fetchAllConv({ offset: pageParam as number, limit: 20 });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
        if (lastPage?.data?.hasMore) {
            return allPages.length * 20;
        }
        return undefined;
    }
});

// Fetch Vault
export const useUserVault = () => {
    return useQuery({
        queryKey: ['chat-vault'],
        queryFn: () => Api.fetchVault(),
    })
}

// Fetch a Single Conversation
export const singleConversationOptions = (username: string) => {
    return queryOptions({
        queryKey: ['conversation', username],
        queryFn: () => Api.fetchParticularUserConv(username),
        staleTime: 1000 * 60 * 5,
    });
};

// Fetch Messages
export const useMessages = (queries: CursorQueries, conversationId: string, enabled = false) => {
    return useInfiniteQuery({
        queryKey: ['messages', conversationId, { limit: queries.limit }],
        maxPages: 5,

        queryFn: ({ pageParam }) => Api.fetchMessages(conversationId, { ...queries, cursor: pageParam }),
        enabled: enabled,
        initialPageParam: undefined,

        getNextPageParam: (lastPage) => {
            return lastPage.data.nextCursor ?? undefined;
        },
    });
};
