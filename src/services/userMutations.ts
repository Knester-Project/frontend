/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Functions
import { authenticateUser, commentOnPost, createReply, createSafetyPost, createUser, deleteComment, deleteReply, flagPost, toggleVibe, validateInvite } from "./api.services";

// Schemas
import type { AuthInput } from "@/schemas/auth.schema";

// Helper Functions
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

    return useMutation({
        mutationFn: (data: { username: string, password: string, referrer: string }) => createUser(data),
        onError: (error) => {
            console.error("Create User failed:", error);
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
