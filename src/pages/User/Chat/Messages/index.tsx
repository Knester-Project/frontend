import { useSuspenseQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

// Services, Hooks and Constants
import { singleConversationOptions, useMessages } from '@/services/userQueries';
import useInfiniteScroll from "@/Hooks/useInfiniteScroll";
import { MESSAGES_LIMIT } from '@/assets/constants';

// UIs
import Header from './Header';
import Empty from './Empty';
import { MessagesSkeleton } from './MessageLoader';
import InputToolbar from './InputToolbar';

// Icons
import { Lock } from 'iconsax-reactjs';

const Index = ({ username }: { username: string }) => {

    const { data } = useSuspenseQuery(singleConversationOptions(username));
    const convData: UsernameConv = data?.data || {};
    const conversationId = convData.conversationId;

    const isEnabled = typeof (convData.conversationId) === "string"

    const { data: messagesData,
        fetchNextPage,
        isLoading,
        hasNextPage,
        isFetchingNextPage } = useMessages({ limit: MESSAGES_LIMIT }, conversationId || "", isEnabled);


    // Pass the active fetch function to your scroll hook
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
        <main className='flex flex-col rounded-xl h-[85vh]'>
            <Header
                profilePicture={headerProps.profilePicture}
                username={headerProps.username}
                isOnline={headerProps.isOnline}
                lastSeen={headerProps.lastSeen}
            />
            <section className="flex justify-center gap-1.5 bg-muted/30 px-4 py-2 border-border border-b">
                <Lock variant='Bold' className="size-3 md:size-3.5 xl:size-4 text-foreground/60" />
                <p className="text-[10px] text-muted-foreground/70 md:text-[11px] xl:text-xs text-center">
                    Messages are end-to-end encrypted. No one outside this chat can read them.
                </p>
            </section>
            <section className="flex-1 max-h-[65vh] overflow-y-auto">
                {conversationId ?
                    <>
                        {isLoading ? (
                            <div className="mt-5">
                                <MessagesSkeleton />
                            </div>
                        ) : (
                            <>
                                {/* <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}>

                                </motion.div> */}

                                {/* Loading next page */}
                                {isFetchingNextPage && (
                                    <MessagesSkeleton />
                                )}

                                {/* No more data */}
                                {!hasNextPage && (
                                    <p className="py-4 font-medium text-foreground/80 text-xs text-center">
                                        You've caught up on all messages!
                                    </p>
                                )}

                                {/* Intersection trigger */}
                                <div ref={loadMoreRef} className="w-full h-4" />
                            </>
                        )}
                    </>
                    :
                    <main className='flex justify-center items-center h-full'>
                        <Empty participant={convData.targetUser} />
                    </main>
                }
            </section>
            <InputToolbar />
        </main>
    );
}

export default Index;