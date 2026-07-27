import { useRef, useState, useEffect, type KeyboardEvent } from "react";
import { AnimatePresence } from "framer-motion";

// Utils
import { cn } from "@/lib/utils";

// UIs
import EmojiPicker from "./EmojiPicker";

// Icons
import { CloseSquare, Send2, GalleryEdit, EmojiHappy } from "iconsax-reactjs";

type InputProps = {
    replyTo?: Message;
    editingMsg?: Message;
    cancelReply?: () => void;
    cancelEdit?: () => void;
}

export default function InputToolbar({ replyTo, editingMsg, cancelReply, cancelEdit }: InputProps) {

    const [text, setText] = useState(editingMsg?.ciphertext ?? "");
    const [showEmoji, setShowEmoji] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const cursorPosRef = useRef(0);

    // Sync text when editingMsg changes
    useEffect(() => {
        setText(editingMsg?.ciphertext ?? "");
    }, [editingMsg]);

    // Track cursor position so emoji inserts at the right spot
    const handleSelect = () => {
        cursorPosRef.current = inputRef.current?.selectionStart ?? text.length;
    };

    const insertEmoji = (emoji: string) => {
        const pos = inputRef.current?.selectionStart ?? cursorPosRef.current;
        const newText = text.slice(0, pos) + emoji + text.slice(pos);
        setText(newText);
        // Move cursor after the inserted emoji
        requestAnimationFrame(() => {
            if (inputRef.current) {
                const newPos = pos + emoji.length;
                inputRef.current.focus();
                inputRef.current.setSelectionRange(newPos, newPos);
                cursorPosRef.current = newPos;
            }
        });
    };

    const handleSend = () => {
        const trimmed = text.trim();
        if (!trimmed) return;
        setText("");
        setShowEmoji(false);
    };

    const handleKey = (e: KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const toggleEmoji = () => {
        setShowEmoji((prev) => {
            if (!prev) {
                cursorPosRef.current = inputRef.current?.selectionStart ?? text.length;
            }
            return !prev;
        });
    };

    return (
        <div className="bg-primary/10 backdrop-blur-lg mt-auto border-border border-t rounded-b-xl">
            {/* Reply preview bar */}
            {replyTo && (
                <div className="flex items-center gap-2 bg-muted/40 px-4 py-2 border-border border-b">
                    <div className="flex-1 pl-2 border-primary border-l-4 min-w-0">
                        <p className="font-semibold text-primary text-xs truncate">
                            {replyTo.senderId === "usr_8a7f3c2e" ? "You" : replyTo.senderId}
                        </p>
                        <p className="text-muted-foreground text-xs truncate">{replyTo.ciphertext}</p>
                    </div>
                    <button onClick={cancelReply} className="hover:bg-muted p-1 rounded-full" aria-label="Cancel reply">
                        <CloseSquare className="size-3 md:size-3.5 xl:size-4 text-muted-foreground" />
                    </button>
                </div>
            )}

            {/* Edit banner */}
            {editingMsg && (
                <div className="flex items-center gap-2 bg-accent/30 px-4 py-2 border-border border-b">
                    <p className="flex-1 font-medium text-xs text-accent-foreground">Editing message</p>
                    <button onClick={cancelEdit} className="font-medium text-destructive text-xs" aria-label="Cancel edit">Cancel</button>
                </div>
            )}

            {/* Emoji picker */}
            <AnimatePresence>
                {showEmoji && (
                    <EmojiPicker onPick={insertEmoji} onClose={() => setShowEmoji(false)} />
                )}
            </AnimatePresence>

            {/* Input row */}
            <div className="flex items-center gap-2 px-3 py-3">
                <button className="flex-shrink-0 hover:bg-primary p-2 rounded-full duration-200 cursor-pointer" aria-label="Attach file">
                    <GalleryEdit className="size-4 md:size-4.5 xl:size-5" />
                </button>
                <textarea
                    ref={inputRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKey}
                    onSelect={handleSelect}
                    onClick={handleSelect}
                    placeholder="Message…"
                    rows={1}
                    maxLength={500}
                    className={cn(
                        "flex-1 bg-background px-4 py-2.5 rounded-md outline-none text-[11px] placeholder:text-muted-foreground md:text-xs xl:text-sm resize-none",
                        "max-h-36 overflow-y-auto leading-relaxed"
                    )}
                    style={{ minHeight: "2.5rem" }}
                    aria-label="Message input"
                />
                <button onClick={toggleEmoji}
                    className={cn("hidden lg:block flex-shrink-0 p-2.5 rounded-full transition-colors cursor-pointer",
                        showEmoji ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                    )}
                    aria-label="Toggle emoji picker" aria-expanded={showEmoji}>
                    <EmojiHappy className="size-4 md:size-4.5 xl:size-5" />
                </button>
                <button
                    onClick={handleSend}
                    disabled={!text.trim()}
                    className="flex-shrink-0 bg-primary disabled:opacity-40 p-2.5 rounded-full text-primary-foreground transition-opacity"
                    aria-label="Send message"
                >
                    <Send2 className="size-3 md:size-3.5 xl:size-4" />
                </button>
            </div>
        </div>
    );
}