import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { sileo } from "sileo";

// Libs and Configs
import { db } from "@/lib/db";
import { getAxiosAuthInstance } from "@/services/config";

// Constants
const userAxios = getAxiosAuthInstance();

export const useChatActions = (conversationId: string) => {

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Clear Chat Mutation
    const clearChatMutation = useMutation({
        mutationFn: async () => {
            const res = await userAxios.delete(`chat/message/clear${conversationId}`);
            return res.data;
        },
        onSuccess: async () => {
            // Hard delete all local messages for this chat
            await db.messages.where('conversationId').equals(conversationId).delete();

            // Invalidate the message list and the inbox
            queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
        },
        onError: (error) => {
            console.error("Failed to clear chat:", error);
            sileo.error({ title: "Failed to clear chat" })
        }
    });

    // Delete Chat Mutation
    const deleteChatMutation = useMutation({
        mutationFn: async () => {
            const res = await userAxios.delete(`chat/delete/conversation/${conversationId}`);
            return res.data;
        },
        onSuccess: async () => {
            // Hard delete all local messages
            await db.messages.where('conversationId').equals(conversationId).delete();

            // Invalidate the inbox so it disappears from the list
            queryClient.invalidateQueries({ queryKey: ["conversations"] });

            // Kick the user back to the inbox screen instantly
            navigate({ to: "/messages", search: { username: undefined, isFeed: undefined } });
        },
        onError: (error) => {
            console.error("Failed to delete chat:", error);
            sileo.error({ title: "Failed to delete chat" })
        }
    });

    return {
        clearChat: () => clearChatMutation.mutate(),
        isClearing: clearChatMutation.isPending,
        deleteChat: () => deleteChatMutation.mutate(),
        isDeleting: deleteChatMutation.isPending,
    };
};