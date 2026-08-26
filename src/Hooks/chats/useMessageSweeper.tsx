import { useEffect } from 'react';
import { db } from '@/lib/db';
import { getTtlMs } from '@/utils/generate';

export const useMessageSweeper = (conversationId: string | null, messageTtl: number | undefined) => {
    useEffect(() => {
        if (!conversationId) return;

        const sweepExpiredMessages = async () => {
            try {
                const threshold = Date.now() - getTtlMs(messageTtl);

                // Find and hard-delete expired messages
                const expiredCount = await db.messages
                    .where('conversationId').equals(conversationId)
                    .and(msg => msg.createdAt < threshold)
                    .delete();

                if (expiredCount > 0) {
                    console.log(`🧹 Swept ${expiredCount} expired messages from local DB.`);
                }
            } catch (error) {
                console.error("Failed to sweep expired messages:", error);
            }
        };

        // Run immediately when the chat opens
        sweepExpiredMessages();

        // Run every 10 minutes while they have the chat open
        const interval = setInterval(sweepExpiredMessages, 10 * 60 * 1000);

        return () => clearInterval(interval);
    }, [conversationId, messageTtl]);
};