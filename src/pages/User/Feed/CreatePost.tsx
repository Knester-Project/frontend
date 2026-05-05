import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sileo } from "sileo";

// Utils, Stores, Services and Constants
import { cn } from "@/lib/utils";
import { meStore } from "@/stores/me.store";
import { useNewPost } from "@/services/userMutations";
import { usePresignedUpload } from "@/Hooks/usePresignedUpload";
import { useTrendingTags } from "@/services/userQueries";
import { shuffle } from "@/utils/format";
import { SUGGESTED_TAGS } from "@/assets/tags";

// UIs
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Icons
import { Hash, X, Send, Plus, GitBranch, Rocket } from "lucide-react";
import { GalleryEdit, Hashtag, Global, Trash, Lock } from "iconsax-reactjs";

const MAX_CHARS = import.meta.env.VITE_POST_LENGTH;
const THREAD_LENGTH = import.meta.env.VITE_THREAD_LENGTH;


// Type Declarations
interface MediaFile {
    file: File;
    url: string;
}

interface SlotData {
    content: string;
    hashtags: string[];
    mediaFiles: MediaFile[];
}

interface CharRingProps {
    content: string;
}

interface HashtagPanelProps {
    hashtags: string[];
    setHashtags: React.Dispatch<React.SetStateAction<string[]>>;
}

interface PostSlotProps {
    avatar?: string;
    username?: string;
    content: string;
    setContent: (v: string) => void;
    mediaFiles: MediaFile[];
    setMediaFiles: React.Dispatch<React.SetStateAction<MediaFile[]>>;
    hashtags: string[];
    setHashtags: React.Dispatch<React.SetStateAction<string[]>>;
    isPrivate: boolean;
    setIsPrivate: React.Dispatch<React.SetStateAction<boolean>>;
    isFirst: boolean;
    onRemove: () => void;
    isThread: boolean;
}

interface ToolbarBtnProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    active?: boolean;
}

// Character Count
function CharRing({ content }: CharRingProps) {

    const remaining = MAX_CHARS - content.length;
    const isOverLimit = remaining < 0;
    const circumference = 2 * Math.PI * 11;
    const strokeDashoffset = circumference - Math.min(content.length / MAX_CHARS, 1) * circumference;

    return (
        <div className="relative flex justify-center items-center size-7 shrink-0">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 26 26">
                <circle cx="13" cy="13" r="11" fill="none" stroke="oklch(0.907 0.000 90)" strokeWidth="2.5" />
                <circle
                    cx="13" cy="13" r="11" fill="none" strokeWidth="2.5" strokeDasharray={circumference}
                    stroke={isOverLimit ? "oklch(0.6 0.22 25)" : remaining <= 50 ? "hsl(43 74% 66%)" : "#fe7f2d"}
                    strokeDashoffset={Math.max(strokeDashoffset, 0)} strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.15s" }}
                />
            </svg>
            {remaining <= 50 && (
                <span className={cn("z-10 font-bold text-[8px] md:text-[9px] xl:text-[10px] montserrat", isOverLimit ? "text-destructive" : "text-gray-600 dark:text-gray-400")}>
                    {remaining}
                </span>
            )}
        </div>
    );
}

// Hash Tag Panel
function HashtagPanel({ hashtags, setHashtags }: HashtagPanelProps) {

    const [input, setInput] = useState("");
    const { data, isLoading, isError } = useTrendingTags();

    const addTag = (tag: string) => {
        const clean = tag.replace(/^#/, "").toLowerCase().trim();
        if (clean && !hashtags.includes(clean) && hashtags.length < 4) {
            setHashtags((prev) => [...prev, clean]);
        }
        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === "Enter" || e.key === " ") && input.trim()) {
            e.preventDefault();
            addTag(input);
        }
        if (e.key === "Backspace" && !input && hashtags.length) {
            setHashtags((prev) => prev.slice(0, -1));
        }
    };

    const remaining = 4 - hashtags.length;

    return (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }} className="overflow-hidden">
            <div className="space-y-3 bg-accent/10 mt-2 p-3 border border-border/60 rounded-xl">
                <div className="flex justify-between items-center montserrat">
                    <p className="font-semibold text-[9px] text-gray-600 md:text-[10px] xl:text-[11px] dark:text-gray-400 uppercase tracking-widest">Hashtags</p>
                    <span className="text-[10px] text-gray-600 dark:text-gray-400">{remaining} remaining</span>
                </div>

                {hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {hashtags.map((tag) => (
                            <span key={tag} className="inline-flex items-center gap-1 bg-primary/10 px-2.5 py-1 rounded-lg font-medium text-[10px] text-primary md:text-[11px] xl:text-xs">
                                #{tag}
                                <button onClick={() => setHashtags((p) => p.filter((t) => t !== tag))} className="cursor-pointer">
                                    <X className="size-2.5" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                {remaining > 0 && (
                    <div className="flex items-center gap-2 bg-background px-3 py-2 border border-border/50 rounded-lg">
                        <Hash className="size-3.5 text-gray-600 dark:text-gray-400 shrink-0" />
                        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                            placeholder="Type a tag and press Space or Enter…"
                            className="flex-1 bg-transparent focus:outline-none text-[11px] placeholder:text-gray-600 md:text-xs xl:text-sm" autoFocus />
                    </div>
                )}

                <div>
                    <p className="mb-1.5 text-[10px] text-gray-600 dark:text-gray-400">Suggestions</p>
                    <div className="flex flex-wrap gap-1.5">
                        {(!isLoading && !isError && data && data?.data.length > 0) ?
                            data.data.map((tag: Tags) => (
                                <button key={`hash_${tag.tag}`} disabled={remaining === 0} onClick={() => addTag(tag.tag)}
                                    className="hover:bg-primary/5 disabled:opacity-30 px-2.5 py-1 border border-border hover:border-primary rounded-lg text-[9px] text-gray-600 md:text-[10px] xl:text-[11px] hover:text-primary dark:text-gray-400 transition-all cursor-pointer disabled:pointer-events-none">
                                    #{tag.tag}
                                </button>
                            ))
                            :
                            shuffle(SUGGESTED_TAGS.filter((t) => !hashtags.includes(t)))
                                .slice(0, 5)
                                .map((tag) => (
                                    <button key={tag} disabled={remaining === 0} onClick={() => addTag(tag)}
                                        className="hover:bg-primary/5 disabled:opacity-30 px-2.5 py-1 border border-border hover:border-primary rounded-lg text-[9px] text-gray-600 md:text-[10px] xl:text-[11px] hover:text-primary dark:text-gray-400 transition-all cursor-pointer disabled:pointer-events-none">
                                        #{tag}
                                    </button>
                                ))
                        }
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// Post Slot Rendering
function PostSlot({ avatar, username, content, setContent, mediaFiles,
    setMediaFiles, hashtags, setHashtags, isPrivate, setIsPrivate, isFirst, onRemove, isThread }: PostSlotProps) {

    const fileRef = useRef<HTMLInputElement>(null);
    const [showTags, setShowTags] = useState(false);
    const remaining = MAX_CHARS - content.length;
    const isOverLimit = remaining < 0;

    // Functions
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const files = Array.from(e.target.files).slice(0, 4 - mediaFiles.length);
        const previews = files.map((f) => ({ file: f, url: URL.createObjectURL(f) }));

        setMediaFiles((prev) => [...prev, ...previews].slice(0, 4));

        // Reset the input's value so the same file can be selected again
        e.target.value = "";
    };

    const removeMedia = (idx: number) => {
        setMediaFiles((prev) => {
            const next = [...prev];
            // Clean up the memory to prevent memory leaks
            URL.revokeObjectURL(next[idx].url);
            next.splice(idx, 1);
            return next;
        });
    };

    return (
        <div className="flex gap-3">
            <div className="flex flex-col items-center shrink-0">
                <Avatar className="rounded-xl size-8 md:size-9 xl:size-10">
                    <AvatarImage src={avatar} />
                    <AvatarFallback className="bg-primary/10 rounded-xl font-semibold text-primary">
                        {username?.slice(0, 2).toUpperCase() || "??"}
                    </AvatarFallback>
                </Avatar>
                {isThread && <div className="flex-1 mt-2 bg-border/50 rounded-full w-0.5 min-h-[16px]" />}
            </div>

            <div className="flex-1 pb-3 min-w-0">
                <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">{username || "user"}</span>
                    {!isFirst && (
                        <button onClick={onRemove} className="p-1 text-gray-600 hover:text-destructive dark:hover:text-destructive dark:text-gray-400/50 transition-colors cursor-pointer">
                            <Trash className="size-3.5" />
                        </button>
                    )}
                </div>

                <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={isFirst ? "What's on your mind?" : "Continue your thread…"}
                    rows={isFirst ? 4 : 3} className={cn(
                        "bg-transparent focus:outline-none w-full text-[11px] placeholder:text-gray-600 md:text-xs xl:text-sm leading-relaxed resize-none hide-scrollbar", isOverLimit && "text-destructive")} />

                <AnimatePresence>
                    {mediaFiles.length > 0 && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                            className={cn("gap-1.5 grid mt-2 rounded-xl overflow-hidden", mediaFiles.length === 1 ? "grid-cols-1" : "grid-cols-3")}>
                            {mediaFiles.map((m, i) => (
                                <div key={i} className="group relative rounded-xl aspect-square overflow-hidden">
                                    <img src={m.url} alt="" className="w-full h-full object-cover" />
                                    <button onClick={() => removeMedia(i)}
                                        className="top-1.5 right-1.5 absolute flex justify-center items-center bg-background rounded-full size-6 md:size-7 xl:size-8 cursor-pointer">
                                        <X className="size-3 md:size-3.5 xl:size-4 group-hover:text-destructive duration-300" />
                                    </button>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showTags && <HashtagPanel hashtags={hashtags} setHashtags={setHashtags} />}
                </AnimatePresence>

                <div className="flex items-center gap-1 mt-2">
                    <input ref={fileRef} type="file" accept="image/*,video/*" multiple hidden onChange={handleFileChange} />
                    <ToolbarBtn icon={<GalleryEdit className="size-3.5" />} label="Media" onClick={() => fileRef.current?.click()} disabled={mediaFiles.length >= 4} />
                    <ToolbarBtn icon={<Hashtag className="size-3.5" />} label={hashtags.length > 0 ? `Tags (${hashtags.length})` : "Tags"}
                        onClick={() => setShowTags((v) => !v)} active={showTags || hashtags.length > 0} />
                    {isFirst && (
                        <ToolbarBtn icon={isPrivate ? <Lock className="size-3.5" /> : <Global className="size-3.5" />} label={isPrivate ? "Private" : "Public"}
                            onClick={() => setIsPrivate((v) => !v)} active={isPrivate} />
                    )}
                    <div className="flex-1" />
                    <CharRing content={content} />
                </div>
            </div>
        </div>
    );
}

// Tool Btn 
function ToolbarBtn({ icon, label, onClick, disabled, active }: ToolbarBtnProps) {
    return (
        <button onClick={onClick} disabled={disabled} className={cn(
            "flex items-center gap-1.5 px-2 py-1.5 rounded-lg font-medium text-[10px] md:text-[11px] xl:text-xs transition-all cursor-pointer",
            active ? "bg-primary/10 text-primary" : "text-gray-600 dark:text-gray-400 hover:bg-accent/20",
            disabled && "opacity-30 pointer-events-none")}>
            {icon}
            <span>{label}</span>
        </button>
    );
}


// Main Component
const emptySlot = (): SlotData => ({ content: "", hashtags: [], mediaFiles: [] });

export default function PostComposer() {

    const user = meStore((state) => state.user);
    const [slots, setSlots] = useState<SlotData[]>([emptySlot()]);
    const [isPrivate, setIsPrivate] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const isThread = slots.length > 1;
    const { uploadFiles } = usePresignedUpload();


    // Functions
    const updateSlot = (idx: number, patch: Partial<SlotData>) =>
        setSlots((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));

    const addSlot = () => {
        if (slots.length < THREAD_LENGTH) setSlots((prev) => [...prev, emptySlot()]);
    };

    const removeSlot = (idx: number) =>
        setSlots((prev) => prev.filter((_, i) => i !== idx));

    const allEmpty = slots.every((s) => !s.content.trim() || s.mediaFiles.length === 0);
    const anyOverLimit = slots.some((s) => s.content.length > MAX_CHARS);

    const newPost = useNewPost()

    // Helper Function
    async function buildPayload(slots: SlotData[], isPrivate: boolean) {

        setIsUploading(true);

        const validSlots = slots.filter(
            (s) => s.content.trim() || s.mediaFiles.length > 0
        );

        const processedSlots = await Promise.all(
            validSlots.map(async (slot) => {
                let mediaUrls: string[] = [];

                if (slot.mediaFiles.length > 0) {
                    // Upload all files in this slot in ONE request
                    const uploads = await uploadFiles(
                        slot.mediaFiles.map((m) => m.file),
                        "post"
                    );

                    // Save Uploads
                    mediaUrls = uploads.map((u) => u.publicUrl);
                }

                return {
                    content: slot.content,
                    hashtags: slot.hashtags,
                    media: mediaUrls,
                    isPrivate,
                };
            })
        );

        setIsUploading(false);
        return processedSlots;
    }

    const handleSubmit = async () => {

        if (allEmpty || anyOverLimit) return;

        try {

            const payload = await buildPayload(slots, isPrivate);

            // Create Post
            newPost.mutate(payload, {
                onSuccess: () => {
                    sileo.success({ title: "New Post !!!", icon: <Rocket className="size-3.5" />, });
                    setSlots([emptySlot()]);
                    setIsPrivate(false);
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onError: (error: any) => {
                    const message = error?.response?.data?.message || "Failed to create post, kindly try again later.";
                    sileo.error({ title: "Error", description: message });
                },
            });
        } catch {
            sileo.error({ title: "Failed to create post, kindly try again later." });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-card shadow-sm border border-border rounded-2xl overflow-hidden">
            <AnimatePresence>
                {isThread && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="px-4 pt-3">
                        <div className="flex items-center gap-1.5 bg-primary/8 px-3 py-2 rounded-xl">
                            <GitBranch className="size-3.5 text-primary" />
                            <span className="font-semibold text-[10px] text-primary md:text-[11px] xl:text-xs montserrat">Thread mode · {slots.length} posts</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="px-4 pt-4">
                {slots.map((slot, idx) => (
                    <PostSlot key={idx} avatar={user?.profile?.profilePicture} username={user?.username} hashtags={slot.hashtags}
                        content={slot.content} setContent={(v) => updateSlot(idx, { content: v.trim() })} mediaFiles={slot.mediaFiles}
                        setMediaFiles={(val) => updateSlot(idx, { mediaFiles: typeof val === "function" ? val(slot.mediaFiles) : val })}
                        setHashtags={(val) => updateSlot(idx, { hashtags: typeof val === "function" ? val(slot.hashtags) : val })}
                        isPrivate={isPrivate} setIsPrivate={setIsPrivate} isFirst={idx === 0} isThread={idx < slots.length - 1} onRemove={() => removeSlot(idx)}
                    />
                ))}
            </div>

            <div className="px-4 pb-2">
                <button onClick={addSlot} disabled={slots.length >= THREAD_LENGTH}
                    className="group flex items-center gap-2 disabled:opacity-30 py-1 text-gray-600 hover:text-primary dark:text-gray-400 text-xs transition-colors cursor-pointer disabled:pointer-events-none">
                    <div className="flex justify-center items-center border border-border group-hover:border-primary/50 border-dashed rounded-full size-5 transition-colors">
                        <Plus className="size-3" />
                    </div>
                    Add to thread
                </button>
            </div>

            <div className="mx-4 bg-border/40 h-px" />

            <div className="flex justify-between items-center px-4 py-2.5">
                <p className="text-[11px] text-gray-600 dark:text-gray-400 montserrat">
                    {isThread ? `${slots.length} posts in thread` : "Single post"}
                </p>
                <Button size="sm" disabled={allEmpty || anyOverLimit || newPost.isPending || isUploading} onClick={handleSubmit} className="gap-1.5 shadow-primary/20 shadow-sm px-4 rounded-lg h-8 font-semibold text-xs">
                    <Send className="size-3.5" />
                    {isThread ? "Post thread" : "Post"}
                </Button>
            </div>
        </div>
    );
}