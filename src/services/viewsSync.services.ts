const viewBuffer = new Set<string>();
let debounceTimer: number | null = null;

export const queueCommentView = (commentId: string) => {
    viewBuffer.add(commentId);

    // If we reach 15 unique comments, sync immediately
    if (viewBuffer.size >= 15) {
        triggerSync();
        return;
    }

    // If the user is scrolling slowly, sync every 10 seconds
    if (!debounceTimer) {
        debounceTimer = window.setTimeout(triggerSync, 10000);
    }
};

const triggerSync = async () => {
    if (viewBuffer.size === 0) return;

    // Snapshot the current IDs and clear the buffer
    const idsToSync = Array.from(viewBuffer);
    console.log("The IDs", idsToSync)
    viewBuffer.clear();
    
    if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
    }

    // try {
    //     // Your Fastify endpoint
    //     await api.post('/comments/sync-views', { commentIds: idsToSync });
    // } catch (err) {
    //     console.error("View sync failed", err);
    // }
};