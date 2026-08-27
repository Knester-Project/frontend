import { useRef, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { sileo } from 'sileo';

// Services, Hooks, Constants, Utils and Stores
import { singleConversationOptions, useMessages } from '@/services/userQueries';
import { useSetupChatEncryption } from '@/Hooks/chats/useChatEncryption';
import useInfiniteScroll from "@/Hooks/useInfiniteScroll";
import { MESSAGES_LIMIT } from '@/assets/constants';
import { meStore } from '@/stores/me.store';
import { useTypingStore } from "@/stores/typing.store";

// UIs
import Header from './Header';
import Empty from './Empty';
import { MessagesSkeleton } from './MessageLoader';
import InputToolbar from './InputToolbar';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { useChatScroll, useJoinActiveConv, useJoinChatRoom, useSyncToDexie } from './SyncUI';
import { useMessageSweeper } from '@/Hooks/chats/useMessageSweeper';

// Icons
import { Lock, Refresh } from 'iconsax-reactjs';
import { useReadMessages } from '@/utils/chat/local.storage';

const Index = ({ username }: { username: string }) => {

    const { user } = meStore();

    // Fetch Metadata
    const { data } = useSuspenseQuery(singleConversationOptions(username));
    const convData = data?.data || {};
    const conversationId = convData.conversationId;
    const isEnabled = typeof (conversationId) === "string";

    // State & Refs
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);

    const scrollToMessage = (messageId: string) => {
        const element = document.querySelector(
            `[data-message-id="${CSS.escape(messageId)}"]`
        );

        if (!element) {
            sileo.info({
                title: "Message isn't currently loaded",
                description: "Scroll up to load older messages, then tap the search result again.",
            });
            return;
        }

        element.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });

        setHighlightedMessageId(messageId);

        setTimeout(() => {
            setHighlightedMessageId(null);
        }, 2000);
    };

    // The Sync Engine
    const {
        data: messagesData,
        fetchNextPage,
        isLoading: isApiLoading,
        hasNextPage,
        isFetchingNextPage
    } = useMessages({ limit: MESSAGES_LIMIT }, conversationId || "", isEnabled);

    // Read strictly from Dexie
    const messageTtlMs = convData.meta?.messageTtl
    const localMessages = useReadMessages(conversationId || "", messageTtlMs || 86400)
    const pageParams = messagesData?.pageParams;

    // IMPORTANT HOOKS
    useJoinActiveConv(conversationId)
    useSetupChatEncryption(convData);
    useSyncToDexie(messagesData);
    useJoinChatRoom(conversationId, user?._id);
    useChatScroll(messagesEndRef, localMessages);
    useMessageSweeper(conversationId, messageTtlMs);

    const loadMoreRef = useInfiniteScroll({
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    });

    // Meta and Participant Details
    const meta = convData.meta;
    const targetUser = convData.targetUser;


    // Header Props
    const headerProps = {
        username: meta?.name.trim() || targetUser.username,
        profilePicture: meta?.avatar.trim() ? meta.avatar : (
            convData.relationship.blockedMe
                ? "/chat_block.png"
                : targetUser.profile?.profilePicture ?? "/chat.png"
        ),
        isOnline: targetUser.profile?.isOnline || false,
        lastSeen: targetUser.profile?.lastSeen || new Date().toLocaleString(),
        relationship: convData.relationship,
        conversationId,
        meta: {
            name: meta?.name || "",
            avatar: meta?.avatar || "",
            type: meta?.type || "private",
            messageTtl: meta?.messageTtl || 86400,
        },
    }

    // Participant Map for MessageBubble
    const participantMap = {
        [targetUser._id]: { username: targetUser.username, avatar: headerProps.profilePicture },
        [user?._id || ""]: { username: user?.username || "Me", avatar: user?.profile?.profilePicture || "/chat.png" }
    };

    // Typing Store
    const typingUsers = useTypingStore(state =>
        conversationId ? state.typingUsers[conversationId] : undefined
    );
    const isSomeoneTyping = typingUsers && typingUsers.size > 0;

    // Today's Banner
    let todayBannerShown = false;
    const isToday = (timestamp: number) => {
        return new Date(timestamp).toDateString() === new Date().toDateString();
    };

    return (
        <main className='flex flex-col rounded-xl h-dvh'>
            <Header {...headerProps} onMessageClick={scrollToMessage} />

            <section className="flex justify-center gap-1 bg-muted/30 px-4 py-2 border-border border-b">
                <Lock variant='Bold' className="size-3 md:size-3.5 xl:size-4 text-foreground/60" />
                <p className="text-[10px] text-muted-foreground/70 md:text-[11px] xl:text-xs text-center">
                    Messages are end-to-end encrypted. No one outside this chat can read them.
                </p>
            </section>

            <section className="flex-1 p-4 max-h-[90vh] overflow-y-auto hide-scrollbar">
                {conversationId ? (
                    <>
                        {isApiLoading && !localMessages?.length ? (
                            <div className="mt-5">
                                <MessagesSkeleton />
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-col gap-y-2">
                                    {hasNextPage && <div ref={loadMoreRef} className="w-full h-4" />}

                                    {isFetchingNextPage && <Refresh className="mx-auto my-2 size-3 md:size-3.5 xl:size-4 animate-spin" />}

                                    {!hasNextPage && localMessages && localMessages.length > 0 && pageParams?.[0] !== undefined ? (
                                        <p className="py-4 font-medium text-foreground/80 text-center smallText">
                                            You've caught up on all messages!
                                        </p>
                                    ) : null}

                                    {localMessages?.map((msg) => {
                                        const msgIsToday = isToday(msg.createdAt);
                                        const showBanner = msgIsToday && !todayBannerShown;

                                        // Toggle the tracker so we don't show the banner twice
                                        if (showBanner) todayBannerShown = true;

                                        return (
                                            <div key={msg.id} className="flex flex-col">
                                                {showBanner && (
                                                    <div className="flex justify-center my-4">
                                                        <span className="bg-muted/60 px-3 py-1 rounded font-medium text-[10px] text-muted-foreground md:text-[11px] xl:text-xs">
                                                            Today
                                                        </span>
                                                    </div>
                                                )}
                                                <MessageBubble message={msg} senderDetails={participantMap[msg.senderId]} highlighted={highlightedMessageId === msg.id} />
                                            </div>
                                        );
                                    })}
                                </div>
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </>
                ) : (
                    <main className='flex justify-center items-center h-full'>
                        <Empty participant={convData.targetUser} />
                    </main>
                )}
            </section>
            {isSomeoneTyping && (
                <TypingIndicator profilePicture={headerProps.profilePicture} />
            )}
            <InputToolbar
                conversationId={conversationId}
                targetUserId={targetUser._id}
                blockedMe={convData.relationship.blockedMe}
                blockedByMe={convData.relationship.blockedByMe}
            />
        </main>
    );
}

export default Index;