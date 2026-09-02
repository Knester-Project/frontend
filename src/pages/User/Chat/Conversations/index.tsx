import { useState } from "react";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

// Services, Hooks, Utils
import { allConversationsOptions } from "@/services/userQueries";
import useInfiniteScroll from "@/Hooks/useInfiniteScroll";
import { cn } from "@/lib/utils";
import { formatLastSeen } from "@/utils/format";

// UI
import { Overlay } from "@/components/common/Overlay";
import New from "./New";

// Icons
import { Add, MessageAdd1, Profile2User } from "iconsax-reactjs";
import CreateGroup from "./CreateGroup";


const Index = () => {

    const [newGroup, setNewGroup] = useState<boolean>(false);
    const [newMessage, setNewMessage] = useState<boolean>(false);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useSuspenseInfiniteQuery(allConversationsOptions());

    // Flatten the nested pages into a single continuous array
    const conversations = data.pages.flatMap(page => page.data?.conversations || []);

    // Attach the infinite scroll intersection observer
    const loadMoreRef = useInfiniteScroll({
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    });

    // Functions
    const toggleNewGroup = () => {
        setNewGroup((prev) => !prev);
        setNewMessage(false);
    }
    const toggleNewMessage = () => {
        setNewMessage((prev) => !prev);
        setNewGroup(false);
    }

    return (
        <>
            {/* New Chat */}
            <Overlay open={newMessage} onClose={toggleNewMessage} variant="bottom">
                <New onClose={toggleNewMessage} />
            </Overlay>

            {/* New Group */}
            <Overlay open={newGroup} onClose={toggleNewGroup} variant="bottom">
                <CreateGroup onClose={toggleNewGroup} />
            </Overlay>

            <main className="flex flex-col bg-background h-full">
                <header className="top-0 z-2 sticky flex justify-between items-center bg-primary/10 backdrop-blur-md px-4 py-4 border-border border-b">
                    <div>
                        <h1 className="font-bold text-foreground text-base md:text-lg xl:text-xl">Messages</h1>
                        <p className="smallText montserrat">{conversations.length} {`Conversation${conversations.length > 1 ? "s" : ""}`}</p>
                    </div>
                    <div className="flex items-center gap-x-3">
                        <button onClick={toggleNewGroup} className="relative unset">
                            <Profile2User className="size-5 md:size-5.5 xl:size-6" variant="Linear" />
                            <Add variant="Bold" className="-right-1 -bottom-1 absolute size-3 md:size-3.5 xl:size-4" />
                        </button>
                        <button onClick={toggleNewMessage} className="bg-primary/50 hover:bg-primary/70 p-2 rounded-full text-primary-foreground duration-200 cursor-pointer">
                            <MessageAdd1 variant="Bold" className="size-4 md:size-4.5 xl:size-5" />
                        </button>
                    </div>
                </header>

                <section className="flex-1 overflow-y-auto hide-scrollbar">
                    {conversations.length === 0 ? (
                        <div className="flex flex-col justify-center items-center h-[70vh] text-muted-foreground">
                            <p>No conversations yet.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col pb-20">
                            {conversations.map((convo: ConversationItem) => (
                                <ConversationCard key={convo.id} convo={convo} />
                            ))}

                            {/* Pagination Trigger Node */}
                            {hasNextPage && <div ref={loadMoreRef} className="h-10" />}

                            {/* Loading Spinner at the bottom */}
                            {isFetchingNextPage && (
                                <div className="flex justify-center p-4">
                                    <span className="border-2 border-primary border-t-transparent rounded-full size-5 animate-spin" />
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </main>
        </>
    );
};


// Individual Conversation Card
const ConversationCard = ({ convo }: { convo: ConversationItem }) => {

    const isPrivate = convo.participants.length === 1;
    const isGroup = convo.participants.length > 2;
    const meta = convo.meta;
    const targetUser = convo.participants[0];

    // Fallbacks for Avatar and Name
    const displayAvatar = meta?.avatar.trim() ? meta.avatar : isGroup ? "/group.png" : targetUser?.profile?.profilePicture ? targetUser.profile.profilePicture : "/chat.png"

    const displayName = meta?.name ? convo.meta.name : targetUser?.username;
    const hasUnread = convo.unread > 0;
    const isOnline = isPrivate && targetUser?.profile?.isOnline;

    return (
        <Link
            to={"/messages"} search={{ username: isPrivate ? targetUser?.username : undefined, group: isGroup ? convo.meta.name : undefined }}
            className="flex items-center gap-4 hover:bg-accent/10 px-4 py-3 border-border/40 border-b transition-colors cursor-pointer"
        >
            {/* Avatar Section */}
            <div className="relative flex-shrink-0">
                <img
                    src={displayAvatar}
                    alt={displayName}
                    className="bg-muted border border-border rounded-full size-12 object-cover"
                />
                {isOnline && (
                    <span className="right-0 bottom-0 absolute bg-green-500 border-2 border-background rounded-full size-3" />
                )}
            </div>

            {/* Title & Preview Strip */}
            <div className="flex flex-col flex-1 justify-center min-w-0">
                <h3 className={cn(
                    "truncate transition-colors",
                    hasUnread ? "font-bold text-foreground" : "font-medium text-foreground/80"
                )}>
                    {displayName}
                </h3>

                <p className={cn(
                    "mt-0.5 text-xs md:text-sm truncate transition-colors",
                    hasUnread ? "font-semibold text-primary" : "text-muted-foreground"
                )}>
                    {hasUnread ? "New messages" : "Tap to view chat"}
                </p>
            </div>

            {/* Time & Unread Badge */}
            <div className="flex flex-col flex-shrink-0 justify-center items-end gap-1.5">
                <span className={cn(
                    "text-[10px] md:text-[11px] xl:text-xs montserrat",
                    hasUnread ? "text-primary font-bold" : "text-muted-foreground"
                )}>
                    {formatLastSeen(new Date(convo.lastActivityAt).toISOString())}
                </span>

                {hasUnread && (
                    <span className="flex justify-center items-center bg-primary shadow-sm rounded-full size-5 font-bold text-[10px] text-primary-foreground montserrat">
                        {convo.unread > 99 ? '99+' : convo.unread}
                    </span>
                )}
            </div>
        </Link>
    );
};

export default Index;