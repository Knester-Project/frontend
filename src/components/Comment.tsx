import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { Drawer } from "vaul";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Schemas, Services, Hooks and Assets
import { commentSchema, type CommentInput } from "@/schemas/comment.schema";
import { useAddComment } from "@/services/userMutations";
import { usePresignedUpload } from "@/Hooks/usePresignedUpload";
import { useComments } from "@/services/userQueries";
import useInfiniteScroll from "@/Hooks/useInfiniteScroll";
import { makeFilesUnique } from "@/utils/format";
import { COMMENT_LIMIT } from "@/assets/constants";

// UIs
import ErrorText from "./ErrorText";
import ToastInline from "./ToastInline";
import CommentCard from "./CommentCard";
import CommentLoader from "./CommentLoader";

// Icons
import { Messages1, GalleryAdd, Send2, CloseCircle } from "iconsax-reactjs";

const Comment = ({ comments, postId, postModel }: { comments: number; postId: string; postModel: string }) => {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [toastMessages, setToastMessages] = useState<ToastInline | null>(null);


    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
        resolver: zodResolver(commentSchema), mode: "onBlur"
    });

    const selectedMedia = watch("media");
    const contentValue = watch("content") || "";

    // Functions
    const closeToast = () => setToastMessages(null);

    const { uploadFiles } = usePresignedUpload();

    const newComment = useAddComment({ postId, limit: COMMENT_LIMIT });
    const onSubmit = async (data: CommentInput) => {

        try {
            setIsUploading(true);

            let mediaUrl: string | null = null;

            // Upload media if exists
            if (selectedMedia && selectedMedia.length > 0 && selectedMedia[0] instanceof File) {

                // Process and give the files unique names BEFORE uploading
                const uniqueFiles = makeFilesUnique(Array.from(selectedMedia) as File[]);

                // Pass the unique files to your upload service
                const uploads = await uploadFiles(uniqueFiles, "post");

                const failedUpload = uploads.some(u => !u.uploadUrl);

                if (failedUpload) {
                    throw new Error("Upload failed");
                }
                
                mediaUrl = uploads[0]?.publicUrl || null;
            }

            if (!data.content.trim() && !mediaUrl) {
                return setToastMessages({
                    title: "Error",
                    message: "Comment cannot be empty.",
                    variant: "error",
                    handleClose: closeToast,
                });
            }

            // Create payload
            const payload = {
                postId,
                postModel,
                content: data.content,
                ...(mediaUrl && { media: mediaUrl }),
            };

            newComment.mutate(payload, {
                onSuccess: () => {
                    setToastMessages({
                        title: "Comment added",
                        message: "Your comment has been added successfully.",
                        variant: "success",
                        handleClose: closeToast,
                    });
                    reset();
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onError: (error: any) => {
                    const message = error?.response?.data?.message || "Couldn't add comment now, kindly try again later.";
                    setToastMessages({
                        title: "Error",
                        message,
                        variant: "error",
                        handleClose: closeToast,
                    });
                    reset();
                },
                onSettled: () => {
                    setIsUploading(false);
                }
            });
        } catch {
            setIsUploading(false);
            setToastMessages({
                title: "Couldn't add comment now, kindly try again later.",
                message: "Couldn't add comment now, kindly try again later.",
                variant: "error",
                handleClose: closeToast,
            });
        }
    };

    const isLoading = isUploading || newComment.isPending;

    // Comments Query
    const { data, fetchNextPage, isLoading: isCommentLoading, hasNextPage, isFetchingNextPage } = useComments({ postId, limit: COMMENT_LIMIT }, isOpen)

    const scrollRef = useRef<HTMLDivElement | null>(null);
    const loadMoreRef = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage, root: scrollRef.current })

    const fetchedComments = data?.pages.flatMap((page) => page.data.comments) ?? [];

    return (
        <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
            {/* Trigger Button */}
            <Drawer.Trigger asChild>
                <button className="flex items-center gap-2 bg-white/30 dark:bg-white/10 shadow-sm backdrop-blur-md px-3 py-1 border border-border rounded-xl hover:text-comment-active transition-all cursor-pointer">
                    <Messages1 className="size-3.5 md:size-4 xl:size-5" />
                    <span className="font-medium text-sm md:text-base xl:text-lg montserrat">{comments}</span>
                </button>
            </Drawer.Trigger>

            <Drawer.Portal>
                <Drawer.Overlay className="z-50 fixed inset-0 bg-background" />
                <Drawer.Content className="right-0 bottom-0 left-0 z-[60] fixed flex flex-col mx-auto border border-border rounded-t-[32px] outline-none max-w-7xl h-[90vh]">
                    <Drawer.Description className="sr-only">Comment Section</Drawer.Description>
                    <div className="flex-shrink-0 bg-gray-300 dark:bg-gray-600 mx-auto my-4 rounded-full w-12 h-1.5 cursor-grab" />

                    <section ref={scrollRef} className="flex-1 p-4 overflow-y-auto hide-scrollbar">

                        <Drawer.Title className="mb-4 px-2 font-bold text-base md:text-lg xl:text-xl">Comments</Drawer.Title>

                        {toastMessages && <ToastInline {...toastMessages} />}

                        {isCommentLoading && (
                            <div className="space-y-4">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <CommentLoader key={i} />
                                ))}
                            </div>
                        )}

                        {(!isCommentLoading && fetchedComments.length === 0) &&
                            <div className="py-10 text-center">
                                No comments yet. Start the conversation!
                            </div>
                        }

                        {fetchedComments.map((comment) => (
                            <CommentCard key={comment._id} comment={comment} />
                        ))}

                        {/* Loading next page */}
                        {isFetchingNextPage && (
                            <div className="space-y-4">
                                {Array.from({ length: 2 }).map((_, i) => (
                                    <CommentLoader key={i} />
                                ))}
                            </div>
                        )}

                        {/* No more data */}
                        {!hasNextPage && fetchedComments.length > 0 && (
                            <p className="py-4 text-primary text-center">
                                No more comments to show
                            </p>
                        )}

                        {/* Intersection trigger */}
                        <div ref={loadMoreRef} className="w-full h-4" />

                    </section>
                    {/* Sticky Input Area */}
                    <div className="p-4 pb-8 border-border border-t">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

                            {/* Media Preview Section */}
                            <AnimatePresence>
                                {selectedMedia?.[0] && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="relative size-20">
                                        <img src={URL.createObjectURL(selectedMedia[0])} className="border border-accent/40 rounded-lg w-full h-full object-cover" alt="preview" />
                                        <button type="button" disabled={isLoading} onClick={() => reset({ media: undefined })}
                                            className={`-top-2 -right-2 absolute rounded-full text-destructive ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}>
                                            <CloseCircle variant="Bold" className="size-5 cursor-pointer" />
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="relative flex items-end gap-x-3 bg-background p-2 border border-border focus-within:border-primary/50 rounded-2xl transition-colors">
                                <textarea  {...register("content")} placeholder={isLoading ? "Posting..." : "Write a comment..."} rows={1} className={`flex-1 bg-transparent px-2 py-2 border-none outline-none focus:ring-0 max-h-44 text-sm md:text-base xl:text-lg resize-none hide-scrollbar ${isLoading ? "opacity-60 cursor-not-allowed" : ""
                                    }`} onInput={(e) => {
                                        const target = e.target as HTMLTextAreaElement;
                                        target.style.height = "auto";
                                        target.style.height = `${target.scrollHeight}px`;
                                    }} />

                                <div className="flex items-center gap-x-2 pb-1">
                                    <label className={`p-2 rounded-full transition-colors ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-accent/30 cursor-pointer"}`}>
                                        <GalleryAdd className="size-5" />
                                        <input disabled={isUploading || newComment.isPending} type="file" className="hidden" accept="image/*,video/*" {...register("media")} />
                                    </label>

                                    <button disabled={contentValue.length === 0 || contentValue.length > 200 || isLoading} type="submit"
                                        className="bg-primary disabled:opacity-50 disabled:grayscale p-2 rounded-full transition-all cursor-pointer">
                                        <Send2 variant="Bold" className="size-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Validation Messages */}
                            <div className="flex justify-between px-2">
                                <span className={`montserrat ${contentValue.length > 200 ? "text-destructive"
                                    : contentValue.length > 180 ? "text-yellow-500" : ""}`}>
                                    {contentValue.length}/200
                                </span>
                                {errors.media && <ErrorText message={errors.media.message as string} />}
                                {errors.content && <ErrorText message={errors.content.message} />}
                            </div>
                        </form>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root >
    );
};

export default Comment;