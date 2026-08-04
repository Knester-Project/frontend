import { useRef, useState, useEffect, type KeyboardEvent } from "react";
import { AnimatePresence } from "framer-motion";
import { sileo } from "sileo";

// Utils
import { cn } from "@/lib/utils";
import { makeFilesUnique } from "@/utils/format";

// UIs
import EmojiPicker from "./EmojiPicker";

// Icons
import { CloseSquare, Send2, GalleryEdit, EmojiHappy } from "iconsax-reactjs";

// Assuming Message type is imported
type InputProps = {
    replyTo?: Message;
    editingMsg?: Message;
    cancelReply?: () => void;
    cancelEdit?: () => void;
}

export default function InputToolbar({ replyTo, editingMsg, cancelReply, cancelEdit }: InputProps) {

    const [text, setText] = useState(editingMsg?.ciphertext ?? "");
    const [showEmoji, setShowEmoji] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<{ url: string; type: "image" | "video" }[]>([]);

    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cursorPosRef = useRef(0);

    const MAX_FILES = 8;
    const MAX_FILE_SIZE_MB = 50;
    const allowedExts = ["jpg", "jpeg", "png", "gif", "webp", "mp4", "mov", "webm"];

    // Sync text when editingMsg changes
    useEffect(() => {
        setText(editingMsg?.ciphertext ?? "");
    }, [editingMsg]);

    // Generate File Previews securely
    useEffect(() => {
        const newPreviews = files.map(file => ({
            url: URL.createObjectURL(file),
            type: file.type.startsWith("video/") ? "video" as const : "image" as const
        }));

        setPreviews(newPreviews);

        // Cleanup memory leaks
        return () => {
            newPreviews.forEach(p => URL.revokeObjectURL(p.url));
        };
    }, [files]);

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

        const availableSlots = MAX_FILES - files.length;
        if (availableSlots <= 0) {
            return sileo.error({ title: `Maximum of ${MAX_FILES} files allowed.` });
        }

        const allowedIncoming = validFiles.slice(0, availableSlots);
        const uniqueFiles = makeFilesUnique([...files, ...allowedIncoming]);

        setFiles(uniqueFiles);
        e.target.value = "";
    };

    const removeFile = (indexToRemove: number) => {
        setFiles(prev => prev.filter((_, i) => i !== indexToRemove));
    };

    // Text & Cursor Logic
    const handleSelect = () => {
        cursorPosRef.current = inputRef.current?.selectionStart ?? text.length;
    };

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

    const handleSend = () => {
        const trimmedText = text.trim();
        if (!trimmedText && files.length === 0) return;

        // onSend(trimmedText, files);

        setText("");
        setFiles([]);
        setShowEmoji(false);
    };

    const handleKey = (e: KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col bg-primary/10 backdrop-blur-lg mt-auto border-border border-t">

            {/* Reply / Edit Banners */}
            {replyTo && (
                <div className="flex items-center gap-2 bg-muted/40 px-4 py-2 border-border border-b">
                    <div className="flex-1 pl-2 border-primary border-l-4 min-w-0">
                        <p className="font-semibold text-primary text-xs truncate">
                            {replyTo.senderId === "me" ? "You" : replyTo.senderId}
                        </p>
                        <p className="text-[11px] text-muted-foreground md:text-xs xl:text-sm truncate">{replyTo.ciphertext}</p>
                    </div>
                    <button onClick={cancelReply} className="hover:bg-muted p-1 rounded-full">
                        <CloseSquare className="size-3 md:size-3.5 xl:size-4 text-muted-foreground" />
                    </button>
                </div>
            )}

            {/* Media Preview Strip */}
            {previews.length > 0 && (
                <div className="flex gap-2 p-2 border-border border-b overflow-x-auto scrollbar-hide">
                    {previews.map((preview, i) => (
                        <div key={i} className="group relative flex-shrink-0 border border-border rounded-lg size-16 md:size-18 xl:size-20 overflow-hidden">
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

            {/* Input Row */}
            <div className="flex items-end gap-2 px-3 py-3">

                <input type="file" ref={fileInputRef} multiple accept={allowedExts.map(ext => `.${ext}`).join(",")} className="hidden" onChange={handleFileSelect} />

                <button onClick={() => fileInputRef.current?.click()}
                    className="flex-shrink-0 hover:bg-primary/20 mb-0.5 p-2 rounded-full text-muted-foreground hover:text-primary duration-200 cursor-pointer"
                    aria-label="Attach file">
                    <GalleryEdit className="size-5 md:size-5.5 xl:size-6" />
                </button>

                <textarea ref={inputRef} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleKey} onSelect={handleSelect}
                    onClick={handleSelect} placeholder="Message…" rows={1} maxLength={500}
                    className={cn(
                        "flex-1 bg-background px-4 py-2.5 rounded-2xl outline-none md:size-xs text-[11px] placeholder:text-muted-foreground xl:text-sm resize-none",
                        "max-h-36 overflow-y-auto leading-relaxed")} style={{ minHeight: "2.75rem" }} />

                <button onClick={() => setShowEmoji(!showEmoji)}
                    className={cn("hidden lg:block flex-shrink-0 mb-0.5 p-2 rounded-full transition-colors cursor-pointer",
                        showEmoji ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-primary/20 hover:text-primary"
                    )}>
                    <EmojiHappy className="size-5 md:size-5.5 xl:size-6" />
                </button>

                <button onClick={handleSend} disabled={!text.trim() && files.length === 0} className="flex-shrink-0 bg-primary disabled:opacity-40 mb-0.5 p-2.5 rounded-full text-primary-foreground transition-opacity cursor-pointer">
                    <Send2 className="size-4 md:size-4.5 xl:size-5" variant="Bold" />
                </button>
            </div>
        </div>
    );
}