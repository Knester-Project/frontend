import { useMutation, useQueryClient } from "@tanstack/react-query";

// Functions
import { authenticateUser, commentOnPost, createSafetyPost, createUser, flagPost, toggleVibe, validateInvite } from "./api.services";

// Schemas
import type { AuthInput } from "@/schemas/auth.schema";


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

// Toggle Vibe for a Post
export function useSafetyPostVibe(postId: string, queries: SafetyQueries) {

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { postId: string, postModel: string }) => toggleVibe(data),

        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["safety-posts"] });

            const previousData = queryClient.getQueryData(["safety-posts", queries]);

            queryClient.setQueryData(["safety-posts", queries], (old: unknown) => {
                if (!old) return old;

                const data = old as { pages: Array<{ data: { data: SafetyPost[] } }> };

                return {
                    ...data,
                    pages: data.pages.map((page: { data: { data: SafetyPost[] } }) => ({
                        ...page,
                        data: {
                            ...page.data,
                            data: page.data.data.map((p: SafetyPost) =>
                                p._id === postId
                                    ? {
                                        ...p,
                                        hasVibed: !p.hasVibed,
                                        vibes: p.hasVibed ? p.vibes - 1 : p.vibes + 1,
                                    }
                                    : p
                            ),
                        },
                    })),
                };
            });

            return { previousData };
        },

        onError: (_err, _vars, context) => {
            queryClient.setQueryData(
                ["safety-posts", queries],
                context?.previousData
            );
        },

        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["safety-posts", queries],
            });
        },
    });
}

// Add Comment
export function useAddComment(commentQueries: CommentQueries) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { postId: string; postModel: string; content: string; media?: string }) => commentOnPost(data),

        onSuccess: (response) => {
            console.log("Comment Added:", response);
            const newComment = response.data;

            queryClient.setQueryData(
                ["comments", commentQueries],
                (old: unknown) => {
                    if (!old) return old;

                    const data = old as {
                        pages: Array<{ data: { comments: PostComment[] } }>;
                        pageParams: unknown[];
                    };

                    return {
                        ...data,
                        pages: data.pages.map((page, index) => {
                            if (index === 0) {
                                return {
                                    ...page,
                                    data: {
                                        ...page.data,
                                        comments: [newComment, ...page.data.comments],
                                    },
                                };
                            }
                            return page;
                        }),
                    };
                }
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

// Flag Post
export function useFlagPost() {

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { postId: string, postModel: string, reason?: string }) => flagPost(data),
        onError: (error) => {
            console.error("Flagging Post Failed:", error);
        },
        onSuccess: () => {
            queryClient.invalidateQueries();
        }
    })
}
