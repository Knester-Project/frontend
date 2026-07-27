import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { sileo } from "sileo";

// Utils
import { formatLastSeen } from "@/utils/format";

// Icons
import { ArrowLeft2, Call, CloseSquare, MoreSquare, Video } from "iconsax-reactjs";

type HeaderProps = {
    profilePicture: string;
    username: string;
    isOnline: boolean;
    lastSeen: string;
}

const Header = ({ profilePicture, username, isOnline, lastSeen }: HeaderProps) => {

    const navigate = useNavigate();
    const [isImageOpen, setIsImageOpen] = useState(false);
    const isTyping = false;

    // Lock body scroll when the image modal is open
    useEffect(() => {
        if (isImageOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isImageOpen]);

    const handleUnavailable = (value: string) => {
        sileo.info({
            title: `${value} is unavailable for now`,
            icon: value === "Voice Call" ? <Call variant="Bold" /> : <Video variant="Bold" />,
        });
    }

    // Handle Escape key to close the modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isImageOpen) setIsImageOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isImageOpen]);

    return (
        <>
            <main className="top-0 z-5 sticky flex items-center gap-3 bg-primary/10 backdrop-blur-lg p-3 md:p-4 xl:p-5 rounded-t-xl">
                <button onClick={() => navigate({ to: "/messages", search: { username: undefined } })}
                    className="hover:bg-primary/10 p-1.5 rounded-full transition-colors cursor-pointer"
                    aria-label="Back">
                    <ArrowLeft2 className="size-4 md:size-4.5 xl:size-5 text-muted-foreground" />
                </button>

                {/* Profile Picture Button */}
                <button
                    onClick={() => setIsImageOpen(true)}
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
                    <p className="font-semibold truncate">{username}</p>
                    <p className={cn("text-[10px] md:text-[11px] xl:text-xs truncate montserrat",
                        isTyping ? "text-primary animate-pulse" : isOnline ? "text-green-500" : "text-muted-foreground")}>
                        {isTyping ? "Typing..." : isOnline ? "Online" : formatLastSeen(lastSeen)}
                    </p>
                </div>

                <div className="flex items-center gap-1">
                    <button onClick={() => handleUnavailable("Voice Call")} className="hover:bg-primary/20 opacity-40 p-2 rounded-full text-foreground/70 cursor-not-allowed" aria-label="Voice call (coming soon)">
                        <Call className="size-4 md:size-4.5 xl:size-5" />
                    </button>
                    <button onClick={() => handleUnavailable("Video Call")} className="hover:bg-primary/20 opacity-40 p-2 rounded-full text-foreground/70 cursor-not-allowed" aria-label="Video call (coming soon)">
                        <Video className="size-4 md:size-4.5 xl:size-5" />
                    </button>
                    <button className="hover:bg-primary/20 p-2 rounded-full text-foreground/70 cursor-pointer" aria-label="More options">
                        <MoreSquare className="size-4 md:size-4.5 xl:size-5" />
                    </button>
                </div>
            </main>

            {/* Full Screen Image Modal */}
            {isImageOpen && (
                <div className="z-60 fixed inset-0 flex flex-col justify-center items-center bg-black/90 backdrop-blur-md p-4 md:p-6 xl:p-8 animate-in duration-200 fade-in"
                    onClick={() => setIsImageOpen(false)}>
                    {/* Close Button */}
                    <button className="top-4 md:top-8 right-4 md:right-8 absolute bg-destructive/10 hover:bg-destructive/20 backdrop-blur-lg p-3 rounded-full text-destructive transition-colors cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsImageOpen(false);
                        }}
                        aria-label="Close modal">
                        <CloseSquare className="size-4 md:size-4.5 xl:size-5" />
                    </button>

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
                </div>
            )}
        </>
    );
}

export default Header;