import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence } from "framer-motion";
import { sileo } from "sileo";

// Utils, Stores, Hooks
import { cn } from "@/lib/utils";
import { makeFilesUnique } from "@/utils/format";
import { getSocket } from "@/utils/socket";
import { meStore } from "@/stores/me.store";
import { useChatUIStore } from "@/stores/chatUI.store";
import { useSendMessage } from "@/Hooks/chats/useSendMessage";
import { useEditMessage } from "@/Hooks/chats/useEditMessage";
import { useInputStates } from "./SyncUI";

// UIs
import EmojiPicker from "./EmojiPicker";
import ReplyBanner from "./ReplyBanner";

// Icons
import { CloseSquare, Send2, GalleryEdit, EmojiHappy, Edit2, MessageEdit } from "iconsax-reactjs";

type InputProps = {
    conversationId: string | null;
    targetUserId?: string;
    blockedMe: boolean;
    blockedByMe: boolean;
}

export default function InputToolbar({ conversationId, targetUserId, blockedMe, blockedByMe }: InputProps) {

    const { user } = meStore()
    const { editingMessage, replyingTo, clearUIState } = useChatUIStore();
    const { sendMessage, isSending } = useSendMessage();
    const { editMessage, isEditing } = useEditMessage();

    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [showEmoji, setShowEmoji] = useState<boolean>(false);

    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cursorPosRef = useRef(0);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const MAX_FILES = 8;
    const MAX_FILE_SIZE_MB = 50;
    const allowedExts = ["jpg", "jpeg", "png", "gif", "webp", "mp4", "mov", "webm"];

    const { text, setText, files, setFiles, previews, retainedMedia, setRetainedMedia, replyPreviewText, originalReplyToId } = useInputStates(inputRef);

    // File Handling Logic
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {

        const incomingFiles = Array.from(e.target.files || []);
        if (!incomingFiles.length) return;

        const validFiles = incomingFiles.filter(file => {
            const ext = file.name.split(".").pop()?.toLowerCase();
            if (!ext || !allowedExts.includes(ext)) {
                sileo.error({ title: `${file.name} has an invalid format.` });
                return false;
            }
            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                sileo.error({ title: `${file.name} exceeds 50MB.` });
                return false;
            }
            return true;
        });

        const currentTotal = files.length + retainedMedia.length;
        const availableSlots = MAX_FILES - currentTotal;

        if (availableSlots <= 0) {
            return sileo.error({ title: `Maximum of ${MAX_FILES} files allowed.` });
        }

        const allowedIncoming = validFiles.slice(0, availableSlots);
        const uniqueFiles = makeFilesUnique([...files, ...allowedIncoming]);

        setFiles(uniqueFiles);
        e.target.value = "";
    };

    const removeFile = (indexToRemove: number) => setFiles(prev => prev.filter((_, i) => i !== indexToRemove));
    const removeRetainedMedia = (indexToRemove: number) => setRetainedMedia(prev => prev.filter((_, i) => i !== indexToRemove));

    // Text & Emoji Logic
    const handleSelect = () => cursorPosRef.current = inputRef.current?.selectionStart ?? text.length;

    const insertEmoji = (emoji: string) => {
        const pos = inputRef.current?.selectionStart ?? cursorPosRef.current;
        const newText = text.slice(0, pos) + emoji + text.slice(pos);
        setText(newText);
        requestAnimationFrame(() => {
            if (inputRef.current) {
                const newPos = pos + emoji.length;
                inputRef.current.focus();
                inputRef.current.setSelectionRange(newPos, newPos);
                cursorPosRef.current = newPos;
            }
        });
    };

    const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);

        const socket = getSocket();
        if (!socket || !conversationId) return;

        if (!isTyping) {
            setIsTyping(true);
            socket.emit("typing:start", conversationId);
        }

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            socket.emit("typing:stop", conversationId);
        }, 2000);
    };

    const handleSend = () => {
        const trimmedText = text.trim();
        if (!trimmedText && files.length === 0 && retainedMedia.length === 0) return;

        if (editingMessage) {
            editMessage(editingMessage, {
                text: trimmedText,
                newFiles: files,
                retainedMediaUrls: retainedMedia,
                replyTo: originalReplyToId
            });
        } else {
            sendMessage({
                conversationId,
                targetUserId,
                text: trimmedText,
                files,
                replyTo: replyingTo?.message?.id
            });
        }

        setText("");
        setFiles([]);
        setRetainedMedia([]);
        setShowEmoji(false);
        clearUIState();
    };

    const handleKey = (e: KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const isWorking = isSending || isEditing;

    return (
        <div className="flex flex-col bg-primary/10 backdrop-blur-lg mt-auto border-border border-t">

            {replyingTo && !editingMessage && (
                <ReplyBanner
                    replyingTo={replyingTo.senderName === user?.username ? "You" : replyingTo.senderName}
                    replyPreview={replyPreviewText}
                    clearState={clearUIState}
                />
            )}

            {editingMessage && (
                <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 border-border border-b">
                    <MessageEdit className="size-3 md:size-3.5 xl:size-4 text-primary" />
                    <p className="flex-1 font-medium text-[10px] text-primary md:text-[11px] xl:text-xs">Editing message</p>
                    <button onClick={clearUIState} className="p-1 rounded-full cursor-pointer">
                        <CloseSquare className="size-3 md:size-3.5 xl:size-4 text-muted-foreground hover:text-destructive" />
                    </button>
                </div>
            )}

            {/* Media Preview Strip (Shows BOTH Retained S3 Media and New Local Previews) */}
            {(previews.length > 0 || retainedMedia.length > 0) && (
                <div className="flex gap-2 p-2 border-border border-b overflow-x-auto scrollbar-hide">
                    {/* Render Old/Retained Media */}
                    {retainedMedia.map((url, i) => (
                        <div key={`retained-${i}`} className="group relative flex-shrink-0 border border-border rounded-lg size-16 md:size-18 xl:size-20 overflow-hidden">
                            {url.match(/\.(mp4|webm|mov)$/i) ? (
                                <video src={url} className="w-full h-full object-cover" />
                            ) : (
                                <img src={url} alt="Previous" className="opacity-80 w-full h-full object-cover" />
                            )}
                            <button onClick={() => removeRetainedMedia(i)} className="top-1 right-1 absolute bg-black/60 hover:bg-destructive opacity-0 group-hover:opacity-100 p-1 rounded-full text-destructive-foreground transition-opacity duration-200 cursor-pointer">
                                <CloseSquare className="size-3" variant="Bold" />
                            </button>
                        </div>
                    ))}

                    {/* Render New Upload Previews */}
                    {previews.map((preview, i) => (
                        <div key={`new-${i}`} className="group relative flex-shrink-0 border border-border rounded-lg size-16 md:size-18 xl:size-20 overflow-hidden">
                            {preview.type === "image" ? (
                                <img src={preview.url} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <video src={preview.url} className="w-full h-full object-cover" />
                            )}
                            <button onClick={() => removeFile(i)} className="top-1 right-1 absolute bg-black/60 hover:bg-destructive opacity-0 group-hover:opacity-100 p-1 rounded-full text-destructive-foreground transition-opacity duration-200 cursor-pointer">
                                <CloseSquare className="size-3" variant="Bold" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {showEmoji && <EmojiPicker onPick={insertEmoji} onClose={() => setShowEmoji(false)} />}
            </AnimatePresence>

            <div className="flex items-center gap-2 px-3 py-3">

                <input type="file" ref={fileInputRef} multiple accept={allowedExts.map(ext => `.${ext}`).join(",")} className="hidden" onChange={handleFileSelect} />

                <button onClick={() => fileInputRef.current?.click()}
                    disabled={blockedMe || blockedByMe || isWorking}
                    className="flex-shrink-0 hover:bg-primary/20 disabled:opacity-50 mb-0.5 p-2 rounded-full text-muted-foreground hover:text-primary duration-200 cursor-pointer"
                    aria-label="Attach file">
                    <GalleryEdit className="size-5 md:size-5.5 xl:size-6" />
                </button>

                <textarea
                    ref={inputRef}
                    value={text}
                    onChange={handleTyping}
                    disabled={blockedMe || blockedByMe || isWorking}
                    onKeyDown={handleKey}
                    onSelect={handleSelect}
                    onClick={handleSelect}
                    placeholder={
                        blockedMe
                            ? "Messaging is unavailable because this user blocked you."
                            : blockedByMe
                                ? "Messaging is unavailable because this user is blocked."
                                : "Enter Your Message…"
                    }
                    rows={1}
                    maxLength={500}
                    className={cn(
                        "flex-1 bg-background disabled:opacity-70 px-4 py-2.5 rounded-md outline-none",
                        "placeholder:text-muted-foreground transition-all duration-75",
                        "resize-none hide-scrollbar leading-relaxed focus:border-primary/30 focus:border"
                    )}
                    style={{
                        minHeight: "44px",
                        maxHeight: "144px",
                    }}
                />

                <button onClick={() => setShowEmoji(!showEmoji)}
                    disabled={blockedMe || blockedByMe || isWorking}
                    className={cn("hidden lg:block flex-shrink-0 disabled:opacity-50 mb-0.5 p-2 rounded-full transition-colors cursor-pointer",
                        showEmoji ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-primary/20 hover:text-primary"
                    )}>
                    <EmojiHappy className="size-5 md:size-5.5 xl:size-6" />
                </button>

                <button onClick={handleSend} disabled={(!text.trim() && files.length === 0 && retainedMedia.length === 0) || isWorking} className="flex-shrink-0 bg-primary disabled:opacity-40 mb-0.5 p-2.5 rounded-full text-primary-foreground transition-opacity cursor-pointer">
                    {editingMessage ?
                        <Edit2 className="size-4 md:size-4.5 xl:size-5" variant="Bold" />
                        :
                        <Send2 className="size-4 md:size-4.5 xl:size-5" variant="Bold" />
                    }
                </button>
            </div>
        </div>
    );
}