import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sileo } from "sileo";

// Utils, Stores, Services
import { cn } from "@/lib/utils";
import { useDeletePostMedia, useUpdatePost } from "@/services/userMutations";
import { usePresignedUpload } from "@/Hooks/usePresignedUpload";

// UIs
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import MediaGridEditor from "@/components/MediaGridEditor";
import { CharRing, HashtagPanel, ToolbarBtn } from "./CreatePost";


// Icons
import { X, Send } from "lucide-react";
import { GalleryEdit, Hashtag, Global, Lock, CloseSquare } from "iconsax-reactjs";
import { POST_LIMIT } from "@/assets/constants";

const MAX_CHARS = import.meta.env.VITE_POST_LENGTH || 500;

interface MediaFile {
    file: File;
    url: string;
}

interface EditPostFormProps {
    post: Post;
    onClose: () => void;
    nextCursor?: string | null,
}

export default function EditPost({ post, onClose, nextCursor }: EditPostFormProps) {

    const [content, setContent] = useState(post.content);
    const [hashtags, setHashtags] = useState<string[]>(post.hashtags);
    const [isPrivate, setIsPrivate] = useState<boolean>(post.isPrivate);
    const [showTags, setShowTags] = useState(post.hashtags.length > 0);

    const [existingMedia, setExistingMedia] = useState<string[]>(post.media);
    const [newMediaFiles, setNewMediaFiles] = useState<MediaFile[]>([]);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [deletingMedia, setDeletingMedia] = useState<string>("");

    const fileRef = useRef<HTMLInputElement>(null);
    const { uploadFiles } = usePresignedUpload();
    const feedQueries = { limit: POST_LIMIT, ...(nextCursor ? { nextCursor } : {}) };

    // Constraints
    const totalMediaCount = existingMedia.length + newMediaFiles.length;
    const remainingChars = MAX_CHARS - content.length;
    const isOverLimit = remainingChars < 0;
    const isEmpty = !content.trim() && totalMediaCount === 0;

    // --- Media Handlers ---
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const allowedSlots = 4 - totalMediaCount;
        if (allowedSlots <= 0) {
            sileo.error({ title: "Maximum of 4 media files allowed." });
            return;
        }

        const files = Array.from(e.target.files).slice(0, allowedSlots);
        const previews = files.map((f) => ({ file: f, url: URL.createObjectURL(f) }));

        setNewMediaFiles((prev) => [...prev, ...previews]);
        e.target.value = "";
    };

    const removeNewMedia = (idx: number) => {
        setNewMediaFiles((prev) => {
            const next = [...prev];
            URL.revokeObjectURL(next[idx].url);
            next.splice(idx, 1);
            return next;
        });
    };

    const updateMedia = useDeletePostMedia(post._id, deletingMedia, "profile-posts", feedQueries)
    const removeExistingMedia = (url: string) => {
        setDeletingMedia(url)
        sileo.action({
            title: "File Deletion",
            description: "Do you wish to delete this file?",
            button: {
                title: "Delete",
                onClick: () => {
                    updateMedia.mutate({ postId: post._id, url }, {
                        onSuccess: () => {
                            sileo.success({ title: "Post Updated" });
                            onClose();
                        },
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onError: (error: any) => {
                            const message = error?.response?.data?.message || "Failed to update post.";
                            sileo.error({ title: "Error", description: message });
                        },
                    });
                    setExistingMedia((prev) => prev.filter((img) => img !== url));
                },
            },
        });
    };

    // --- Submission ---
    const updatePost = useUpdatePost("profile-posts", feedQueries);
    const handleSubmit = async () => {
        if (isEmpty || isOverLimit) return;

        // Check if anything actually changed (Basic dirty check)
        const isDirty =
            content !== post.content ||
            isPrivate !== post.isPrivate ||
            JSON.stringify(hashtags) !== JSON.stringify(post.hashtags) ||
            JSON.stringify(existingMedia) !== JSON.stringify(post.media) ||
            newMediaFiles.length > 0;

        if (!isDirty) {
            sileo.info({ title: "No changes detected." });
            onClose();
            return;
        }

        try {
            setIsUploading(true);
            let uploadedUrls: string[] = [];

            // Only upload if there are NEW files
            if (newMediaFiles.length > 0) {
                const uploads = await uploadFiles(
                    newMediaFiles.map((m) => m.file),
                    "post"
                );
                uploadedUrls = uploads.map((u) => u.publicUrl);
            }

            // Combine the kept existing media with the newly uploaded media
            const finalMediaUrls = [...existingMedia, ...uploadedUrls];

            const payload = {
                content: content.trim(),
                hashtags,
                media: finalMediaUrls,
                isPrivate,
            };

            updatePost.mutate({ id: post._id, ...payload }, {
                onSuccess: () => {
                    sileo.success({ title: "Post Updated" });
                    onClose();
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onError: (error: any) => {
                    const message = error?.response?.data?.message || "Failed to update post.";
                    sileo.error({ title: "Error", description: message });
                },
            });
        } catch {
            sileo.error({ title: "Failed to update post, kindly try again later." });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-card shadow-sm p-4 border border-border rounded-2xl overflow-hidden">
            <header className="flex justify-between items-center mb-4">
                <h2 className="font-bold">Edit Post</h2>
                <button onClick={onClose} className="hover:bg-destructive/10 p-1 rounded-md text-gray-500 hover:text-destructive transition-colors cursor-pointer">
                    <CloseSquare className="size-4 md:size-4.5 xl:size-5" />
                </button>
            </header>

            <div className="flex gap-3">
                <Avatar className="rounded-md size-8 md:size-9 xl:size-10 shrink-0">
                    <AvatarImage src={post.user.profile?.profilePicture} />
                    <AvatarFallback className="bg-primary/10 rounded-md font-semibold text-primary">
                        YOU
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-3 min-w-0">
                    <span className="font-semibold">{post.user.username}</span>

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's on your mind?"
                        rows={4}
                        className={cn("bg-transparent focus:outline-none w-full text-[11px] placeholder:text-gray-600 md:text-xs xl:text-sm leading-relaxed resize-none hide-scrollbar", isOverLimit && "text-destructive")}
                    />

                    {/* Existing Media Grid */}
                    {existingMedia.length > 0 && (
                        <div className="space-y-1">
                            <p className="text-[10px] text-muted-foreground">Existing Media</p>
                            <MediaGridEditor
                                mediaUrls={existingMedia}
                                onDelete={removeExistingMedia}
                                disabled={isUploading || updatePost.isPending || updateMedia.isPending}
                            />
                        </div>
                    )}

                    {/* New Media Previews */}
                    <AnimatePresence>
                        {newMediaFiles.length > 0 && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-1">
                                <p className="mt-2 text-[10px] text-muted-foreground">New Media</p>
                                <div className={cn("gap-1.5 grid rounded-xl overflow-hidden", newMediaFiles.length === 1 ? "grid-cols-1" : "grid-cols-3")}>
                                    {newMediaFiles.map((m, i) => (
                                        <div key={i} className="group relative border border-border rounded-xl aspect-square overflow-hidden">
                                            <img src={m.url} alt="Preview" className="w-full h-full object-cover" />
                                            <button onClick={() => removeNewMedia(i)} className="top-1.5 right-1.5 absolute flex justify-center items-center bg-background/80 hover:bg-destructive backdrop-blur-sm rounded-full size-6 md:size-7 xl:size-8 hover:text-white transition-colors cursor-pointer">
                                                <X className="size-3 md:size-3.5 xl:size-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Hashtags */}
                    <AnimatePresence>
                        {showTags && (
                            <HashtagPanel hashtags={hashtags} setHashtags={setHashtags} />
                        )}
                    </AnimatePresence>

                    {/* Toolbar */}
                    <div className="flex items-center gap-1 pt-2 border-border/50 border-t">
                        <input ref={fileRef} type="file" accept="image/*,video/*" multiple hidden onChange={handleFileChange} />

                        <ToolbarBtn icon={<GalleryEdit className="size-3 md:size-3.5 xl:size-4" />} label="Media" onClick={() => fileRef.current?.click()} disabled={totalMediaCount >= 4} />

                        <ToolbarBtn icon={<Hashtag className="size-3 md:size-3.5 xl:size-4" />} label={hashtags.length > 0 ? `Tags (${hashtags.length})` : "Tags"} onClick={() => setShowTags((v) => !v)} active={showTags || hashtags.length > 0} />

                        <ToolbarBtn icon={isPrivate ? <Lock className="size-3 md:size-3.5 xl:size-4" /> : <Global className="size-3 md:size-3.5 xl:size-4" />} label={isPrivate ? "Private" : "Public"} onClick={() => setIsPrivate((v) => !v)} active={isPrivate} />

                        <div className="flex-1" />
                        <CharRing content={content} />
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="ghost" size="sm" onClick={onClose} disabled={isUploading || updatePost.isPending} className="hover:bg-destructive/50 text-destructive hover:text-destructive text-xs">
                            Cancel
                        </Button>
                        <Button size="sm" disabled={isEmpty || isOverLimit || updatePost.isPending || isUploading} onClick={handleSubmit} className="gap-1.5 shadow-primary/20 shadow-sm px-5 rounded-lg font-semibold text-xs">
                            <Send className="size-3.5" />
                            {isUploading || updatePost.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}