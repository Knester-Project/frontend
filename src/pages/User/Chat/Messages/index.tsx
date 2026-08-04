import { useEffect } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useLiveQuery } from 'dexie-react-hooks';

// Libs, Services, Hooks, Constants and Utils
import { db } from '@/lib/db';
import { singleConversationOptions, useMessages } from '@/services/userQueries';
import useInfiniteScroll from "@/Hooks/useInfiniteScroll";
import { MESSAGES_LIMIT } from '@/assets/constants';
import { parseRedisMessage } from '@/utils/format';
import { useSetupChatEncryption } from '@/Hooks/useChatEncryption';

// UIs
import Header from './Header';
import Empty from './Empty';
import { MessagesSkeleton } from './MessageLoader';
import InputToolbar from './InputToolbar';
import MessageBox from './MessageBox';

// Icons
import { Lock } from 'iconsax-reactjs';

const Index = ({ username }: { username: string }) => {

    // Fetch Metadata
    const { data } = useSuspenseQuery(singleConversationOptions(username));
    const convData: UsernameConv = data?.data || {};
    const conversationId = convData.conversationId;
    const isEnabled = typeof (conversationId) === "string";

    // Generate & Save AES Key to Zustand
    useSetupChatEncryption(convData);

    // The Sync Engine (React Query)
    const {
        data: messagesData,
        fetchNextPage,
        isLoading: isApiLoading,
        hasNextPage,
        isFetchingNextPage
    } = useMessages({ limit: MESSAGES_LIMIT }, conversationId || "", isEnabled);

    // Move API Data to Local Dexie DB
    useEffect(() => {
        if (!messagesData || !messagesData.pages) return;

        const syncToLocal = async () => {
            // Flatten the React Query pages into a single array
            const allFetchedMessages = messagesData.pages.flatMap(page => page.data.messages || []);

            if (allFetchedMessages.length === 0) return;

            // Parse and format for Dexie strictly
            const formattedForDexie = allFetchedMessages.map(msg => (parseRedisMessage(msg)));

            // BulkPut inserts new messages and updates existing ones (ignoring duplicates)
            await db.messages.bulkPut(formattedForDexie);
        };

        syncToLocal();
    }, [messagesData]);

    // Read strictly from Dexie
    const localMessages = useLiveQuery(
        () => conversationId
            ? db.messages.where('conversationId').equals(conversationId).sortBy('createdAt')
            : [],
        [conversationId]
    );

    // Pagination trigger
    const loadMoreRef = useInfiniteScroll({
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    });

    const meta = convData.meta;
    const targetUser = convData.targetUser;

    const headerProps = {
        username: meta?.name ?? targetUser.username,
        profilePicture: meta?.avatar ?? targetUser.profile?.profilePicture ?? "/chat.png",
        isOnline: targetUser.profile?.isOnline || false,
        lastSeen: targetUser.profile?.lastSeen || new Date().toLocaleString(),
    }

    return (
        <main className='flex flex-col rounded-xl h-dvh'>
            <Header {...headerProps} />

            <section className="flex justify-center gap-1.5 bg-muted/30 px-4 py-2 border-border border-b">
                <Lock variant='Bold' className="size-3 md:size-3.5 xl:size-4 text-foreground/60" />
                <p className="text-[10px] text-muted-foreground/70 md:text-[11px] xl:text-xs text-center">
                    Messages are end-to-end encrypted. No one outside this chat can read them.
                </p>
            </section>

            <section className="flex-1 p-4 max-h-[70vh] overflow-y-auto">
                {conversationId ? (
                    <>
                        {isApiLoading && !localMessages?.length ? (
                            <div className="mt-5">
                                <MessagesSkeleton />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
\                                {hasNextPage && <div ref={loadMoreRef} className="w-full h-4" />}

                                {isFetchingNextPage && <MessagesSkeleton />}

                                {!hasNextPage && localMessages && localMessages?.length > 0 && (
                                    <p className="py-4 font-medium text-foreground/80 text-xs text-center">
                                        You've caught up on all messages!
                                    </p>
                                )}

                                {localMessages?.map((msg) => (
                                    <div key={msg.id}>
                                        <MessageBox message={msg} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <main className='flex justify-center items-center h-full'>
                        <Empty participant={convData.targetUser} />
                    </main>
                )}
            </section>

            <InputToolbar />
        </main>
    );
}

export default Index;