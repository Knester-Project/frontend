import { useState } from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { sileo } from "sileo";

// Utils and Stores
import { formatLastSeen } from "@/utils/format";
import { useTypingStore } from "@/stores/typing.store";

// UIs
import { Overlay } from "@/components/common/Overlay";
import Actions from "./Actions";

// Icons
import { ArrowLeft2, Call, MoreSquare, Video } from "iconsax-reactjs";
import SearchMessage from "./SearchMessage";

type HeaderProps = {
    profilePicture: string;
    username: string;
    isOnline: boolean;
    lastSeen: string;
    relationship: {
        inCircle: boolean;
        hasReported: boolean;
        blockedByMe: boolean;
        blockedMe: boolean;
    };
    meta: Omit<Meta, "createdAt" | "owner">;
    conversationId: string | null;
    onMessageClick: (messageId: string) => void;
}

const Header = ({ profilePicture, username, isOnline, lastSeen, relationship, meta, conversationId, onMessageClick }: HeaderProps) => {

    const navigate = useNavigate();
    const [isImageOpen, setIsImageOpen] = useState<boolean>(false);
    const [optionsOpen, setOptionsOpen] = useState<boolean>(false);
    const [search, setSearch] = useState<boolean>(false);


    // Functions
    const toggleImages = () => setIsImageOpen((prev) => !prev);
    const toggleOptions = () => setOptionsOpen((prev) => !prev);
    const toggleSearch = () => {
        setOptionsOpen(false);
        setSearch((prev) => !prev);
    }

    const handleUnavailable = (value: string) => {
        sileo.info({
            title: `${value} is unavailable for now`,
            icon: value === "Voice Call" ? <Call variant="Bold" /> : <Video variant="Bold" />,
        });
    }

    const actionProps = {
        inCircle: relationship.inCircle,
        hasReported: relationship.hasReported,
        blockedByMe: relationship.blockedByMe,
        blockedMe: relationship.blockedMe,
        profilePicture: profilePicture,
        onClose: toggleOptions,
        meta,
        isPrivate: true,
        conversationId,
        toggleSearch,
    }

    const typingUsers = useTypingStore(state =>
        conversationId ? state.typingUsers[conversationId] : undefined
    );
    const isTyping = typingUsers && typingUsers.size > 0;

    return (
        <>
            {search ?
                <SearchMessage conversationId={conversationId} toggleSearch={toggleSearch} onMessageClick={onMessageClick} />
                : <main className="top-0 z-5 sticky flex items-center gap-3 bg-primary/10 backdrop-blur-lg p-3 md:p-4 xl:p-5">
                    <button onClick={() => navigate({ to: "/messages", search: { username: undefined } })}
                        className="hover:bg-primary/10 p-1.5 rounded-full transition-colors cursor-pointer"
                        aria-label="Back">
                        <ArrowLeft2 className="size-4 md:size-4.5 xl:size-5 text-muted-foreground" />
                    </button>

                    {/* Profile Picture Button */}
                    <button
                        onClick={toggleImages}
                        className="relative flex-shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95 transition-transform cursor-pointer"
                        aria-label={`View ${username}'s profile picture`}
                    >
                        <img
                            src={profilePicture}
                            alt={username}
                            className="ring-border rounded-full ring-2 size-8 md:size-9 xl:size-10 object-cover"
                        />
                        {isOnline && (
                            <span className="right-0 bottom-0 absolute bg-green-500 border-2 border-card rounded-full size-3 md:size-3.5 xl:size-4" />
                        )}
                    </button>

                    <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{username}</p>
                        <p className={cn("text-[10px] md:text-[11px] xl:text-xs truncate montserrat",
                            isTyping ? "text-primary animate-pulse" : isOnline ? "text-green-500" : "text-muted-foreground")}>
                            {isTyping ? "Typing..." : isOnline ? "Online" : `Last Seen ${formatLastSeen(lastSeen)}`}
                        </p>
                    </div>

                    <div className="flex items-center gap-1">
                        <button onClick={() => handleUnavailable("Voice Call")} className="hover:bg-primary/20 opacity-40 p-2 rounded-full text-foreground/70 cursor-not-allowed" aria-label="Voice call (coming soon)">
                            <Call className="size-4 md:size-4.5 xl:size-5" />
                        </button>
                        <button onClick={() => handleUnavailable("Video Call")} className="hover:bg-primary/20 opacity-40 p-2 rounded-full text-foreground/70 cursor-not-allowed" aria-label="Video call (coming soon)">
                            <Video className="size-4 md:size-4.5 xl:size-5" />
                        </button>
                        <button onClick={toggleOptions} className="hover:bg-primary/20 p-2 rounded-full text-foreground/70 cursor-pointer" aria-label="More options">
                            <MoreSquare className="size-4 md:size-4.5 xl:size-5" />
                        </button>
                    </div>
                </main>
            }
            {/* Full Screen Image Modal */}
            {isImageOpen && (
                <Overlay open={isImageOpen} onClose={toggleImages}>
                    {/* Image and Details Container */}
                    <div className="flex flex-col items-center animate-in duration-200 zoom-in-95" onClick={(e) => e.stopPropagation()}>
                        <img src={profilePicture} alt={username}
                            className="shadow-2xl rounded-2xl md:rounded-3xl ring-1 ring-white/10 max-w-full max-h-[60vh] md:max-h-[70vh] object-contain"
                        />

                        <div className="space-y-2 mt-4 md:mt-6 xl:mt-8 text-center">
                            <h2 className="font-bold text-xl md:text-2xl xl:text-3xl tracking-tight">{username}</h2>
                            <div className="flex justify-center items-center gap-2">
                                <span className={cn(
                                    "rounded-full size-2.5",
                                    isOnline ? "bg-green-500" : "bg-muted-foreground"
                                )} />
                                <p className="text-muted-foreground montserrat">
                                    {isOnline ? "Currently Online" : `Last seen: ${formatLastSeen(lastSeen)}`}
                                </p>
                            </div>
                        </div>
                    </div>
                </Overlay>
            )}
            <Overlay open={optionsOpen} onClose={toggleOptions} variant="bottom">
                <Actions {...actionProps} />
            </Overlay>
        </>
    );
}

export default Header;