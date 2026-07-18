/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient, useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";

// Functions
import * as Api from "./api.services";

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
function updateInfiniteData<TItem>(
    old: unknown,
    updater: (item: TItem) => TItem | null
) {
    if (!old) return old;

    const data = old as InfiniteData<any>;

    return {
        ...data,
        pages: data.pages.map((page) => ({
            ...page,
            data: {
                ...page.data,

                // Map the updater, then immediately filter out any nulls
                ...(page.data?.data && {
                    data: page.data.data
                        .map(updater)
                        .filter((item: any) => item !== null),
                }),
                ...(page.data?.posts && {
                    posts: page.data.posts
                        .map(updater)
                        .filter((item: any) => item !== null),
                }),
                ...(page.data?.comments && {
                    comments: page.data.comments
                        .map(updater)
                        .filter((item: any) => item !== null),
                }),
                ...(page.data?.replies && {
                    replies: page.data.replies
                        .map(updater)
                        .filter((item: any) => item !== null),
                }),
            },
        })),
    };
}

// Helper for Optimistic Mutations
function useCreateOptimisticMutation<TVars>({
    queryKey,
    mutationFn,
    updater,
    invalidateOnSettled = true
}: {
    queryKey: unknown[];
    mutationFn: (vars: TVars) => Promise<any>;
    updater: (item: any, vars: TVars) => any | null;
    invalidateOnSettled?: boolean;
}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn,
        onMutate: async (vars: TVars) => {
            await queryClient.cancelQueries({ queryKey });
            const previousData = queryClient.getQueryData(queryKey);

            queryClient.setQueryData(queryKey, (old: unknown) =>
                updateInfiniteData(old, (item) => updater(item, vars))
            );

            return { previousData };
        },
        onError: (_err, _vars, ctx) => {
            queryClient.setQueryData(queryKey, ctx?.previousData);
        },
        onSettled: () => {
            if (invalidateOnSettled) {
                queryClient.invalidateQueries({ queryKey });
            }
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

// New Contact
export function useNewContact() {
    return useMutation({
        mutationFn: (data: ContactPayload) => Api.newContact(data),
        onError: (error) => {
            console.error("New Contact Error:", error);
        },
    })
}

// New WaitList
export function useNewWaitList() {
    return useMutation({
        mutationFn: (data: WaitListPayload) => Api.newWaitList(data),
        onError: (error) => {
            console.error("New Wait List Error:", error);
        },
    })
}

// Validate Users
export function useValidateUser() {
    return useMutation({
        mutationFn: (data: { invitationCode: string }) => Api.validateInvite(data),
        onError: (error) => {
            console.error("Validation failed:", error);
        },
    })
}

// Create User
export function useCreateUser() {

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { username: string, password: string, referrer: string }) => Api.createUser(data),
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
        mutationFn: (data: AuthInput) => Api.authenticateUser(data),
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
        mutationFn: (data: SafetyInput) => Api.createSafetyPost(data),
        onError: (error) => {
            console.error("Safety Post Creation Failed:", error);
        },
    })
}

// Toggle Vibe for a Safety Post
export function useSafetyPostVibe(postId: string, queries: SafetyQueries) {
    return useCreateOptimisticMutation({
        queryKey: ["safety-posts", queries],
        mutationFn: Api.toggleVibe,
        updater: (p: SafetyPost) =>
            p._id === postId ? toggleVibeField(p) : p,
    });
}

// Flag Safety Post
export function useFlagPost(postId: string, queries: SafetyQueries) {
    return useCreateOptimisticMutation({
        queryKey: ["safety-posts", queries],
        mutationFn: Api.flagPost,
        updater: (p: SafetyPost) =>
            p._id === postId ? flagItemField(p) : p,
    });
}

// Add Comment
export function useAddComment(commentQueries: CommentQueries) {
    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (data: { postId: string; postModel: string; content: string; media?: string }) => Api.commentOnPost(data),

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
        mutationFn: Api.toggleVibe,
        updater: (c: PostComment) =>
            c._id === commentId ? toggleVibeField(c) : c,
    });
}

// Flag Comment
export function useFlagComment(commentId: string, queries: CommentQueries) {
    return useCreateOptimisticMutation({
        queryKey: ["comments", queries],
        mutationFn: Api.flagPost,
        updater: (c: PostComment) =>
            c._id === commentId ? flagItemField(c) : c,
    });
}

// Delete Comment
export function useDeleteComment(commentId: string, queries: CommentQueries) {
    return useCreateOptimisticMutation({
        queryKey: ["comments", queries],
        mutationFn: Api.deleteComment,
        updater: (c: PostComment) =>
            c._id === commentId ? { ...c, isDeleted: true, content: "This comment has been deleted" } : c,
    });
}

// Add Reply
export function useAddReply(replyQueries: ReplyQueries) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { commentId?: string; parentReplyId?: string; content: string }) => Api.createReply(data),

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
        mutationFn: Api.toggleVibe,
        updater: (r: Reply) =>
            r._id === replyId ? toggleVibeField(r) : r,
    });
}

// Flag Reply
export function useFlagReply(replyId: string, queries: ReplyQueries) {
    return useCreateOptimisticMutation({
        queryKey: ["replies", queries],
        mutationFn: Api.flagPost,
        updater: (r: Reply) =>
            r._id === replyId ? flagItemField(r) : r,
    });
}

// Delete Reply
export function useDeleteReply(replyId: string, queries: ReplyQueries) {
    return useCreateOptimisticMutation({
        queryKey: ["replies", queries],
        mutationFn: Api.deleteReply,
        updater: (r: Reply) =>
            r._id === replyId ? { ...r, isDeleted: true, content: "This reply has been deleted" } : r,
    });
}

// Sync/Update/Create Profile
export function useSyncProfile(username: string = "me") {
    const queryClient = useQueryClient();
    const queryKey = ['profile', username];

    return useMutation({
        mutationFn: (data: Partial<MyProfile>) => Api.updateProfile(data),

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
        mutationFn: (url: string) => Api.deleteMedia(url),

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
        mutationFn: (inCircle: boolean) => inCircle ? Api.leaveCircle(targetUsername) : Api.joinCircle(targetUsername),
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
        mutationFn: (isBlocked: boolean) => isBlocked ? Api.unblockUser(targetUsername) : Api.blockUser(targetUsername),
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
        mutationFn: (data: { reason: string, shouldBlock?: boolean }) => Api.reportUser({ ...data, reportedUser: targetUsername }),
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
        mutationFn: (data: PostPayload[]) => Api.newPost(data),
        onError: (error) => {
            console.error("Post Creation failed:", error);
        },
    })
}

// Toggle Vibe for Feed Post/Trending Post/Circle Post
export function usePostVibe(postId: string, queryKey: string, feedQueries: CursorQueries) {
    return useCreateOptimisticMutation({
        queryKey: [queryKey, feedQueries],
        mutationFn: Api.toggleVibe,
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
        mutationFn: Api.flagPost,
        updater: (p: Post) =>
            p._id === postId ? flagItemField(p) : p,
    });
}

// Update Post
export function useUpdatePost(queryKey: string, feedQueries: CursorQueries) {
    return useCreateOptimisticMutation<EditPostPayload>({
        queryKey: [queryKey, feedQueries],
        mutationFn: Api.updatePost,
        updater: (p: Post, vars: EditPostPayload) => {
            if (p._id === vars.id) {
                return {
                    ...p,
                    ...vars,
                    edited: true
                };
            }
            if (p.thread && p.thread.length > 0) {
                return {
                    ...p, thread: p.thread.map((child) =>
                        child._id === vars.id ? { ...child, ...vars, edited: true } : child
                    )
                };
            }
            return p;
        },
    });
}

// Delete Post Media
export function useDeletePostMedia(postId: string, urlToRemove: string, queryKey: string, feedQueries: CursorQueries) {
    return useCreateOptimisticMutation({
        queryKey: [queryKey, feedQueries],
        mutationFn: () => Api.editPostMedia({ postId, url: urlToRemove }),
        updater: (p: Post) => {

            // Main post match
            if (p._id === postId) {
                return { ...p, media: p.media.filter((url) => url !== urlToRemove) };
            }

            // Thread child match
            if (p.thread && p.thread.length > 0) {
                return {
                    ...p, thread: p.thread.map((child) =>
                        child._id === postId ? { ...child, media: child.media.filter(url => url !== urlToRemove) } : child
                    )
                };
            }

            return p;
        },
        invalidateOnSettled: false,
    });
}

// Delete Post
export function useDeletePost(
    postId: string,
    queryKey: string,
    feedQueries: CursorQueries
) {
    return useCreateOptimisticMutation({
        queryKey: [queryKey, feedQueries],
        mutationFn: () => Api.deletePost(postId),
        updater: (p: Post) => {

            // If it's the main post, return null to delete it completely from the feed
            if (p._id === postId) {
                return null;
            }

            // If it's a child inside a thread, remove it from the thread array
            if (p.thread && p.thread.length > 0) {
                return {
                    ...p,
                    thread: p.thread.filter((child) => child._id !== postId),
                };
            }

            // Otherwise, return the post untouched
            return p;
        },
        invalidateOnSettled: false,
    });
}

// Create New Advert
export function useNewAdvert() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: AdvertPayload) => Api.createAdvert(data),
        onError: (error) => {
            console.error("Advert Creation failed:", error);
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({
                queryKey: ["myAdverts"],
            });
        }
    })
}

// Edit Advert
export function useUpdateAdvert() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: EditAdvertPayload) => Api.editAdvert(data),
        onError: (error) => {
            console.error("Advert Update failed:", error);
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({
                queryKey: ["myAdverts"],
            });
        }
    })
}

// Delete Image and Update Advert
export function useUpdateAdvertMedia() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { url: string, advertId: string }) => Api.updateAdvertMedia(data),
        onError: (error) => {
            console.error("Advert Media Update failed:", error);
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({
                queryKey: ["myAdverts"],
            });
        }
    })
}

// Delete Advert
export function useDeleteAdvert() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => Api.deleteAdvert(id),
        onError: (error) => {
            console.error("Failed to Delete Advert:", error);
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({
                queryKey: ["myAdverts"],
            });
        }
    })
}

// New Push Notification Subscription
export function useNewNotSub() {
    return useMutation({
        mutationFn: (data: PushSubscription) => Api.newSubscription(data),
        onError: (error) => {
            console.error("Failed to add Notification Subscription:", error);
        }
    })
}