import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, type PanInfo } from 'framer-motion';

// Stores & Utils
import { useCryptoStore } from '@/stores/crypto.store';
import { meStore } from '@/stores/me.store';
import { useChatUIStore } from '@/stores/chatUI.store';
import { decrypt } from '@/utils/chat/encrytion';
import { db } from '@/lib/db';
import { cn } from '@/lib/utils';
import { detectMediaType } from '@/utils/format';

// UIs
import { MediaGrid } from '@/components/MediaGrid';

// Icons
import { Lock1, Edit2, Trash, More, ArrowUp2, CloseSquare } from 'iconsax-reactjs';
import { useDeleteMessage } from '@/Hooks/chats/useDeleteMessage';

interface MessageBoxProps {
    message: Message;
    senderDetails?: {
        username: string;
        avatar: string;
    };
}

type ParsedPayload = {
    content: string;
    media: string[];
    replyTo: string | null;
};

export default function MessageBubble({ message, senderDetails }: MessageBoxProps) {

    const { user } = meStore();
    const getSessionKey = useCryptoStore((state) => state.getSessionKey);
    const { setReplyingTo, setEditingMessage } = useChatUIStore();
    const { deleteMessage } = useDeleteMessage()

    // Component State
    const [payload, setPayload] = useState<ParsedPayload | null>(null);
    const [quotedText, setQuotedText] = useState<string | null>(null);
    const [error, setError] = useState<boolean>(false);
    const [showMenu, setShowMenu] = useState(false);

    const isMe = message.senderId === user?._id;
    const senderName = isMe ? "You" : senderDetails?.username || "Unknown";

    // Framer Motion Swipe Logic
    const x = useMotionValue(0);
    const controls = useAnimation();

    // Transform the swipe distance into the opacity and scale of the reply icon
    const replyIconOpacity = useTransform(x, [0, 50], [0, 1]);
    const replyIconScale = useTransform(x, [0, 50], [0.5, 1]);

    const handleDragEnd = async (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        // If swiped right past 50px threshold
        if (info.offset.x > 50) {
            setReplyingTo({ message, senderName });
        }
        // Snap back with a bouncy spring
        controls.start({ x: 0, transition: { type: "spring", stiffness: 400, damping: 25 } });
    };

    // Decryption & Quoted Message Fetching
    useEffect(() => {
        let isMounted = true;

        const processMessage = async () => {
            try {
                const sessionKey = getSessionKey(message.conversationId);
                if (!sessionKey) return;

                // Decrypt
                const decryptedString = await decrypt(message.ciphertext, message.iv, message.tag, sessionKey);
                const parsed: ParsedPayload = JSON.parse(decryptedString);

                // Fetch Quoted Message if replyTo exists
                if (parsed.replyTo) {
                    const quotedMsg = await db.messages.get(parsed.replyTo);
                    if (quotedMsg) {
                        try {
                            const quotedDecrypted = await decrypt(quotedMsg.ciphertext, quotedMsg.iv, quotedMsg.tag, sessionKey);
                            const quotedPayload = JSON.parse(quotedDecrypted);
                            if (isMounted) setQuotedText(quotedPayload.content || "Media");
                        } catch {
                            if (isMounted) setQuotedText("Encrypted message");
                        }
                    } else {
                        if (isMounted) setQuotedText("Original message deleted");
                    }
                }

                if (isMounted) {
                    setPayload(parsed);
                    setError(false);
                }
            } catch {
                if (isMounted) setError(true);
            }
        };

        processMessage();
        return () => { isMounted = false; };
    }, [message, getSessionKey]);

    const timeString = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).format(new Date(message.createdAt));

    // Actions
    const handleEdit = () => {
        setEditingMessage(message);
        setShowMenu(false);
    };

    const handleDelete = () => {
        deleteMessage(message);
        setShowMenu(false);
    };

    return (
        <div className={cn("relative flex w-full", isMe ? "justify-end" : "justify-start")}>

            {/* The Hidden Reply Icon that reveals on swipe */}
            <motion.div className="top-1/2 left-0 absolute flex justify-center items-center bg-muted rounded-full size-8 -translate-y-1/2" style={{ opacity: replyIconOpacity, scale: replyIconScale }}>
                <ArrowUp2 className="size-3 md:size-3.5 xl:size-4 text-primary -rotate-90" variant="Bold" />
            </motion.div>

            {/* The Draggable Message Container */}
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={{ left: 0, right: 0.1 }}
                onDragEnd={handleDragEnd}
                animate={controls}
                style={{ x }}
                className={cn("z-10 flex gap-2 max-w-[85%] md:max-w-[70%] font-medium")}
            >
                <div className={cn(
                    "relative flex flex-col shadow-sm p-3",
                    isMe ? "bg-primary/60 text-primary-foreground rounded-2xl rounded-br-sm"
                        : "bg-accent/10 text-foreground border border-accent/20 rounded-2xl rounded-bl-sm"
                )}>

                    {/* Context Menu Dropdown */}
                    {isMe && (
                        <div className="top-1 -left-6 absolute">
                            <button onClick={() => setShowMenu(!showMenu)} className="p-1 rounded-full cursor-pointer">
                                {showMenu ? <CloseSquare className="hover:bg-destructive/40 size-3 md:size-3.5 xl:size-4 hover:text-destructive" />
                                    : <More className="hover:bg-muted size-3 md:size-3.5 xl:size-4 text-muted-foreground rotate-90" />
                                }
                            </button>

                            {showMenu && (
                                <div className="top-full left-0 z-20 absolute bg-card shadow-lg mt-1 border border-border rounded-xl w-28 overflow-hidden smallText">
                                    <button onClick={handleEdit} className="flex items-center gap-2 hover:bg-primary/60 px-3 py-2 w-full text-foreground transition-colors cursor-pointer">
                                        <Edit2 className="size-3 md:size-3.5 xl:size-4" />
                                        Edit
                                    </button>

                                    <button onClick={handleDelete} className="flex items-center gap-2 hover:bg-destructive/40 px-3 py-2 border-border border-t w-full text-destructive transition-colors cursor-pointer">
                                        <Trash className="size-3 md:size-3.5 xl:size-4" />
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Encryption States */}
                    {error && (
                        <div className="flex items-center gap-2 text-destructive/80 smallText">
                            <Lock1 variant="Bold" className="size-3 md:size-3.5 xl:size-4" />
                            <span className="italic">Decryption failed</span>
                        </div>
                    )}

                    {!payload && !error && (
                        <div className="flex items-center gap-2 opacity-50">
                            <Lock1 variant="Broken" className="size-3 md:size-3.5 xl:size-4 animate-pulse" />
                            <span className="text-xs italic">Decrypting...</span>
                        </div>
                    )}

                    {/* Success State */}
                    {payload && !error && (
                        <div className="flex flex-col">

                            {/* Quoted Reply Banner */}
                            {payload.replyTo && (
                                <div className={cn(
                                    "opacity-90 mb-2 p-2 border-l-4 rounded-lg smallText",
                                    isMe ? "bg-primary-foreground/10 border-primary-foreground/50"
                                        : "bg-background border-primary"
                                )}>
                                    <p className="opacity-80 mb-0.5 font-semibold text-[10px] md:text-[11px] text-xs">Replying</p>
                                    <p className="text-[10px] md:text-[11px] text-xs truncate">{quotedText || "..."}</p>
                                </div>
                            )}

                            {/* Your Professional Media Grid */}
                            {payload.media && payload.media.length > 0 && (
                                <MediaGrid
                                    media={payload.media.map(url => ({
                                        url,
                                        type: detectMediaType(url)
                                    }))}
                                />
                            )}

                            {/* Text Content */}
                            {payload.content && (
                                <p className="break-words leading-relaxed whitespace-pre-wrap">
                                    {payload.content}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Timestamps & Meta  */}
                    <div className={cn("flex justify-end items-center gap-1.5 mt-1.5", isMe ? "text-primary-foreground/80" : "text-muted-foreground")}>
                        {message.edited && <span className="text-[10px] italic">Edited</span>}
                        <span className="font-medium text-[10px] md:text-[11px] xl:text-xs montserrat">
                            {timeString}
                        </span>

                        {/* Message Sync Status */}
                        {isMe && (
                            <div className="flex justify-center items-center">
                                {/* Pending — transmitting */}
                                {message.syncStatus === "pending" && (
                                    <span className="relative flex justify-center items-center size-3">
                                        <span className="absolute inset-0 border border-current border-t-transparent rounded-full animate-spin" />
                                        <span className="bg-current rounded-full size-1" />
                                    </span>
                                )}

                                {/* Sent — transmission completed */}
                                {message.syncStatus === "sent" && (
                                    <span className="relative flex justify-center items-center size-3">
                                        <span className="absolute inset-0 opacity-50 border border-current rounded-full" />
                                        <span className="bg-current rounded-full size-1.5" />
                                    </span>
                                )}

                                {/* Delivered — reached recipient */}
                                {message.syncStatus === "delivered" && (
                                    <span className="relative flex justify-center items-center size-4">
                                        <span className="left-0 absolute opacity-50 border border-current rounded-full size-2.5" />
                                        <span className="right-0 absolute border border-current rounded-full size-2.5" />
                                    </span>
                                )}

                                {/* Read — recipient has opened it */}
                                {message.syncStatus === "read" && (
                                    <span className="relative flex justify-center items-center size-3.5">
                                        <span className="absolute inset-0 opacity-60 border border-current rounded-full" />
                                        <span className="bg-current rounded-full size-1.5" />
                                    </span>
                                )}

                                {/* Failed */}
                                {message.syncStatus === "failed" && (
                                    <span className="relative flex justify-center items-center size-3">
                                        <span className="absolute bg-destructive w-3 h-px rotate-45" />
                                        <span className="absolute bg-destructive w-3 h-px -rotate-45" />
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </motion.div>
        </div>
    );
}