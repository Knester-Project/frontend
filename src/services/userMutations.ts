/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient, useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";

// Functions
import { authenticateUser, blockUser, commentOnPost, createReply, createSafetyPost, createUser, deleteComment, deleteMedia, deleteReply, flagPost, joinCircle, leaveCircle, newPost, reportUser, toggleVibe, unblockUser, updateProfile, validateInvite } from "./api.services";

// Schemas
import type { AuthInput } from "@/schemas/auth.schema";

// Stores
import { meStore } from "@/stores/me.store";


// Helper Functions

// Type
type InfiniteData<T> = {
    pages: Array<{ data: T }>;
};

// Helper to update Infinite Query Data
function updateInfiniteData<TItem>(old: unknown, updater: (item: TItem) => TItem) {

    if (!old) return old;

    const data = old as InfiniteData<{ data?: TItem[]; comments?: TItem[], replies?: TItem[] }>;

    return {
        ...data,
        pages: data.pages.map((page) => ({
            ...page,
            data: {
                ...page.data,
                ...(page.data.data && {
                    data: page.data.data.map(updater),
                }),
                ...(page.data.comments && {
                    comments: page.data.comments.map(updater),
                }),
                ...(page.data.replies && {
                    replies: page.data.replies.map(updater),
                }),
            },
        })),
    };
}

// Helper for Optimistic Mutations
function useCreateOptimisticMutation<TVars>
    ({ queryKey, mutationFn, updater }: {
        queryKey: unknown[];
        mutationFn: (vars: TVars) => Promise<any>;
        updater: (item: any) => any;
    }) {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn,

        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey });

            const previousData = queryClient.getQueryData(queryKey);

            queryClient.setQueryData(queryKey, (old: unknown) =>
                updateInfiniteData(old, updater)
            );

            return { previousData };
        },

        onError: (_err, _vars, ctx) => {
            queryClient.setQueryData(queryKey, ctx?.previousData);
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });
}

// Helper to toggle vibe
const toggleVibeField = <T extends { hasVibed: boolean; vibes: number }>(item: T): T => ({
    ...item,
    hasVibed: !item.hasVibed,
    vibes: item.hasVibed ? item.vibes - 1 : item.vibes + 1,
});

// Helper to flag item
const flagItemField = <T extends { hasFlagged: boolean; flags: number }>(item: T): T => ({
    ...item,
    hasFlagged: true,
    flags: item.hasFlagged ? item.flags : item.flags + 1,
});

type PrependInfiniteData<T> = {
    pages: Array<{ data: T }>;
    pageParams: unknown[];
};

// Helper for Infinite Queries
function prependToInfiniteQuery<TItem, TKey extends string>(
    old: unknown,
    key: TKey,
    newItem: TItem
): PrependInfiniteData<Record<TKey, TItem[]>> {

    if (!old) {
        return {
            pages: [
                {
                    data: {
                        [key]: [newItem],
                    } as Record<TKey, TItem[]>,
                },
            ],
            pageParams: [undefined],
        };
    }

    const data = old as PrependInfiniteData<Record<TKey, TItem[]>>;

    return {
        ...data,
        pages: data.pages.map((page, index) => {
            if (index === 0) {
                return {
                    ...page,
                    data: {
                        ...page.data,
                        [key]: [newItem, ...page.data[key]],
                    },
                };
            }
            return page;
        }),
    };
}

// Helper function for profile cache
const updateProfileCache = async (queryClient: QueryClient, queryKey: QueryKey, updater: (oldData: Me) => Me) => {
    // Cancel outgoing refetch
    await queryClient.cancelQueries({ queryKey });

    // Snapshot the previous value
    const previousData = queryClient.getQueryData<Me>(queryKey);

    // Optimistically update to the new value
    if (previousData) {
        queryClient.setQueryData<Me>(queryKey, updater(previousData));
    }

    return { previousData };
};

// Validate Users
export function useValidateUser() {

    return useMutation({
        mutationFn: (data: { invitationCode: string }) => validateInvite(data),
        onError: (error) => {
            console.error("Validation failed:", error);
        },
    })
}

// Create User
export function useCreateUser() {

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { username: string, password: string, referrer: string }) => createUser(data),
        onError: (error) => {
            console.error("Create User failed:", error);
        },
        onSuccess: async () => {
            queryClient.invalidateQueries();
            meStore.getState().ensureUser(queryClient);
        }
    })
}

// Authenticate User
export function useAuthUser() {

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: AuthInput) => authenticateUser(data),
        onError: (error) => {
            console.error("User Authentication failed:", error);
        },
        onSuccess: async () => {
            queryClient.invalidateQueries();
            meStore.getState().ensureUser(queryClient);
        }
    })
}

// Create Post
export function useCreateSafetyPost() {

    return useMutation({
        mutationFn: (data: SafetyInput) => createSafetyPost(data),
        onError: (error) => {
            console.error("Safety Post Creation Failed:", error);
        },
    })
}

// Toggle Vibe for a Safety Post
export function useSafetyPostVibe(postId: string, queries: SafetyQueries) {
    return useCreateOptimisticMutation({
        queryKey: ["safety-posts", queries],
        mutationFn: toggleVibe,
        updater: (p: SafetyPost) =>
            p._id === postId ? toggleVibeField(p) : p,
    });
}

// Flag Safety Post
export function useFlagPost(postId: string, queries: SafetyQueries) {
    return useCreateOptimisticMutation({
        queryKey: ["safety-posts", queries],
        mutationFn: flagPost,
        updater: (p: SafetyPost) =>
            p._id === postId ? flagItemField(p) : p,
    });
}

// Add Comment
export function useAddComment(commentQueries: CommentQueries) {
    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (data: { postId: string; postModel: string; content: string; media?: string }) => commentOnPost(data),

        onSuccess: (response) => {
            const newComment = response.data;

            queryClient.setQueryData(
                ["comments", commentQueries],
                (old) => prependToInfiniteQuery(old, "comments", newComment)
            );
        },

        onError: (error) => {
            console.error("Adding Comment Failed:", error);
        },

        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["comments", commentQueries],
            });
        },
    });
}

// Toggle Vibe for Comment
export function useCommentVibe(commentId: string, queries: CommentQueries) {
    return useCreateOptimisticMutation({
        queryKey: ["comments", queries],
        mutationFn: toggleVibe,
        updater: (c: PostComment) =>
            c._id === commentId ? toggleVibeField(c) : c,
    });
}

// Flag Comment
export function useFlagComment(commentId: string, queries: CommentQueries) {
    return useCreateOptimisticMutation({
        queryKey: ["comments", queries],
        mutationFn: flagPost,
        updater: (c: PostComment) =>
            c._id === commentId ? flagItemField(c) : c,
    });
}

// Delete Comment
export function useDeleteComment(commentId: string, queries: CommentQueries) {
    return useCreateOptimisticMutation({
        queryKey: ["comments", queries],
        mutationFn: deleteComment,
        updater: (c: PostComment) =>
            c._id === commentId ? { ...c, isDeleted: true, content: "This comment has been deleted" } : c,
    });
}

// Add Reply
export function useAddReply(replyQueries: ReplyQueries) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { commentId?: string; parentReplyId?: string; content: string }) => createReply(data),

        onSuccess: (response) => {
            const newReply = response.data;

            queryClient.setQueryData(
                ["replies", replyQueries],
                (old) => prependToInfiniteQuery(old, "replies", newReply)
            );
        },

        onError: (error) => {
            console.error("Adding Reply Failed:", error);
        },

        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["replies", replyQueries],
            });
        },
    });
}

// Toggle/UnToggle Vibe For Reply
export function useReplyVibe(replyId: string, queries: ReplyQueries) {
    return useCreateOptimisticMutation({
        queryKey: ["replies", queries],
        mutationFn: toggleVibe,
        updater: (r: Reply) =>
            r._id === replyId ? toggleVibeField(r) : r,
    });
}

// Flag Reply
export function useFlagReply(replyId: string, queries: ReplyQueries) {
    return useCreateOptimisticMutation({
        queryKey: ["replies", queries],
        mutationFn: flagPost,
        updater: (r: Reply) =>
            r._id === replyId ? flagItemField(r) : r,
    });
}

// Delete Reply
export function useDeleteReply(replyId: string, queries: ReplyQueries) {
    return useCreateOptimisticMutation({
        queryKey: ["replies", queries],
        mutationFn: deleteReply,
        updater: (r: Reply) =>
            r._id === replyId ? { ...r, isDeleted: true, content: "This reply has been deleted" } : r,
    });
}

// Sync/Update/Create Profile
export function useSyncProfile(username: string = "me") {
    const queryClient = useQueryClient();
    const queryKey = ['profile', username];

    return useMutation({
        mutationFn: (data: Partial<MyProfile>) => updateProfile(data),

        onMutate: async (newValues) => {
            return await updateProfileCache(queryClient, queryKey, (old) => ({
                ...old,
                profile: old.profile ? { ...old.profile, ...newValues } : null
            }));
        },

        onError: (_err, _, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(queryKey, context.previousData);
            }
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey }),
    });
}

// Delete Media From Profile
export function useDeleteMedia(username: string = "me") {
    const queryClient = useQueryClient();
    const queryKey = ['profile', username];

    return useMutation({
        mutationFn: (url: string) => deleteMedia(url),

        onMutate: async (deletedUrl) => {
            return await updateProfileCache(queryClient, queryKey, (old) => ({
                ...old,
                profile: old.profile ? {
                    ...old.profile,
                    // Filter out the deleted URL from the array
                    media: old.profile.media ? old.profile.media.filter(url => url !== deletedUrl) : []
                } : null
            }));
        },

        onError: (_err, _, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(queryKey, context.previousData);
            }
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey }),
    });
}

// Join/Leave Circle, Block/Unblock and Report
export function useRelationshipActions(targetUsername: string) {

    const queryClient = useQueryClient();
    const queryKey = ['profile', targetUsername];

    // Helper for optimistic updates
    const updateCache = async (updater: (old: UserDetails) => UserDetails) => {
        await queryClient.cancelQueries({ queryKey });
        const previousData = queryClient.getQueryData<UserDetails>(queryKey);
        if (previousData) {
            queryClient.setQueryData<UserDetails>(queryKey, updater(previousData));
        }
        return { previousData };
    };

    const onError = (context: any) => {
        if (context?.previousData) queryClient.setQueryData(queryKey, context.previousData);
    };

    const onSettled = () => queryClient.invalidateQueries({ queryKey });

    // Join/Leave Circle
    const toggleCircle = useMutation({
        mutationFn: (inCircle: boolean) => inCircle ? leaveCircle(targetUsername) : joinCircle(targetUsername),
        onMutate: async (currentlyInCircle) =>
            updateCache((old) => ({
                ...old,
                relationship: { ...old.relationship, inCircle: !currentlyInCircle }
            })),
        onError: (_, __, ctx) => onError(ctx),
        onSettled
    });

    // Block/Unblock
    const toggleBlock = useMutation({
        mutationFn: (isBlocked: boolean) => isBlocked ? unblockUser(targetUsername) : blockUser(targetUsername),
        onMutate: async (currentlyBlocked) =>
            updateCache((old) => ({
                ...old,
                relationship: { ...old.relationship, hasBlocked: !currentlyBlocked }
            })),
        onError: (_, __, ctx) => onError(ctx),
        onSettled
    });

    // Report
    const report = useMutation({
        mutationFn: (data: { reason: string, shouldBlock?: boolean }) => reportUser({ ...data, reportedUser: targetUsername }),
        onMutate: async () =>
            updateCache((old) => ({
                ...old,
                relationship: { ...old.relationship, hasReported: true }
            })),
        onError: (_, __, ctx) => onError(ctx),
        onSettled
    });

    return { toggleCircle, toggleBlock, report };
}

// Create New Post
export function useNewPost() {

    return useMutation({
        mutationFn: (data: PostPayload[]) => newPost(data),
        onError: (error) => {
            console.error("Post Creation failed:", error);
        },
    })
}

// Toggle Vibe for Feed Post/Trending Post/Circle Post
export function usePostVibe(postId: string, queryKey: string, feedQueries: CursorQueries) {
    return useCreateOptimisticMutation({
        queryKey: [queryKey, feedQueries],
        mutationFn: toggleVibe,
        updater: (p: Post) => {
            // If it is the main parent post
            if (p._id === postId) {
                return toggleVibeField(p);
            }

            // If it is the nested post
            if (p.thread && p.thread.length > 0) {
                return {
                    ...p,
                    thread: p.thread.map((child) =>
                        child._id === postId ? toggleVibeField(child) : child
                    )
                };
            }

            // Otherwise, return the post untouched
            return p;
        },
    });
}

// Flag a Feed Post/Trending Post/Circle Post
export function usePostFlag(postId: string, queryKey: string, feedQueries: CursorQueries) {
    return useCreateOptimisticMutation({
        queryKey: [queryKey, feedQueries],
        mutationFn: flagPost,
        updater: (p: Post) =>
            p._id === postId ? flagItemField(p) : p,
    });
}