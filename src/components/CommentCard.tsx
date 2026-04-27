import { useState, useRef } from "react";
import { Link } from "@tanstack/react-router";

// Utils and Services
import { dateConverter, detectMediaType } from "@/utils/format";
import { useCommentVibe, useDeleteComment, useFlagComment } from "@/services/userMutations";
import { useReplies } from "@/services/userQueries";
import useInfiniteScroll from "@/Hooks/useInfiniteScroll";

// UIs
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MediaGrid } from "./MediaGrid";
import Views from "./Views";
import CommentVibe from "./CommentVibe";
import CommentFlag from "./CommentFlag";
import CommentReply from "./CommentReply";
import CommentLoader from "./CommentLoader";
import ReplyCard from "./ReplyCard";
import CommentDelete from "./CommentDelete";
import CommentReplyBtn from "./CommentReplyBtn";

// Icons
import { ArrowDown2, ArrowUp2, Lock, Verify } from "iconsax-reactjs";


const CommentCard = ({ comment }: { comment: PostComment }) => {

    const [showReplies, setShowReplies] = useState<boolean>(false);
    const [userVibed, setUserVibed] = useState<boolean>(comment.hasVibed);
    const [userFlagged, setUserFlagged] = useState<boolean>(comment.hasFlagged);
    const [userDeleted, setUserDeleted] = useState<boolean>(comment.isDeleted);
    const [replyForm, setReplyForm] = useState<boolean>(false);
    const [newReply, setNewReply] = useState<Reply[] | null>(null);

    // Functions
    const toggleForm = () => {
        if (userDeleted) return;
        setReplyForm((prev) => !prev);
    }

    const handleNewReply = (newReplies: Reply[]) => {
        setNewReply(newReplies);
        setReplyForm(false);
    }

    const toggleVibe = useCommentVibe(comment._id, { postId: comment.post, limit: 4 });
    const handleToggle = () => {
        if (userDeleted) return;
        setUserVibed((prev) => !prev);
        toggleVibe.mutate({ postId: comment._id, postModel: "Comment" }, {
            onError: () => {
                setUserVibed((prev) => !prev);
            },
        });
    }

    const flagComment = useFlagComment(comment._id, { postId: comment.post, limit: 4 })
    const handleFlagged = () => {
        if (userDeleted) return;
        if (userFlagged) return;
        setUserFlagged(true);
        flagComment.mutate({ postId: comment._id, postModel: "Comment" }, {
            onError: () => {
                setUserFlagged(false);
            },
        });
    }

    const deleteComment = useDeleteComment(comment._id, { postId: comment.post, limit: 4 });
    const handleDeletion = () => {
        if (userDeleted) return;
        setUserDeleted(true);
        deleteComment.mutate(comment._id, {
            onError: () => {
                setUserFlagged(false);
            },
        });
    }

    // Replies Query
    const { data, fetchNextPage, isLoading, hasNextPage, isFetchingNextPage } = useReplies({ id: comment._id, type: "comment", limit: 4 }, showReplies);
    const replies = data?.pages.flatMap((page) => page.data.replies) ?? [];

    // Scroll Ref and Infinite Scroll for Replies
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const loadMoreRef = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage, root: scrollRef.current });

    return (
        <main className={` bg-accent/20 shadow-sm mb-2 p-4 md:p-5 xl:p-6 border rounded-3xl`}>
            {/* Header */}
            <header className="flex justify-between items-center">
                <div className="flex items-center gap-x-3">
                    {/* Avatar Section */}
                    <Link disabled={comment.user.profile?.profileLock} to="/profile" search={{ profile: comment.owner ? "me" : comment.user.username }}>
                        <Avatar className="shadow-sm border border-white/10 size-10 md:size-11 xl:size-12">
                            <AvatarImage src={comment.user.profile?.profilePicture ?? "/default.svg"} />
                            <AvatarFallback className="bg-primary/10 font-bold text-primary">
                                {comment.user.username.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </Link>

                    {/* Text & Badges Section */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-x-1">
                            <p className="font-semibold text-sm md:text-base xl:text-lg leading-none">
                                {comment.user.username}
                            </p>
                            {comment.user.profile?.profileLock && (
                                <Lock variant="Bold" className="size-4 md:size-4.5 xl:size-5 text-foreground/60" />
                            )}
                            {comment.user.isPremium && (
                                <Verify variant="Bold" className="size-4 md:size-4.5 xl:size-5 text-premium" />
                            )}
                            {comment.user.isModerator && (
                                <Verify variant="Bold" className="size-4 md:size-4.5 xl:size-5 text-moderator" />
                            )}
                            {comment.user.isCore && (
                                <Verify variant="Bold" className="size-4 md:size-4.5 xl:size-5 text-core" />
                            )}
                        </div>

                        <p className="mt-0.5 font-medium text-[10px] text-gray-400 md:text-xs tracking-wide">
                            {dateConverter(comment.createdAt)}
                        </p>
                    </div>
                </div>

                {/* Views */}
                <Views views={comment.views} />
            </header>

            {/* Content and Media */}
            <section className="mt-2">
                <p className={`${userDeleted ? "text-red-600 dark:text-red-300 italic" : ""} mb-2`}>{comment.content}</p>
                {(comment.media && !userDeleted) && (
                    <MediaGrid media={[{ url: comment.media, type: detectMediaType(comment.media) }]} />
                )}
            </section>

            {/* Actions */}
            <div className="flex justify-between mt-3">

                <div className="flex items-center gap-2">
                    <CommentVibe handleToggle={handleToggle} userVibed={userVibed} vibes={comment.vibes} />

                    <CommentReplyBtn toggleForm={toggleForm} replyForm={replyForm} replies={comment.replies} />

                    <CommentFlag handleFlagging={handleFlagged} userFlagged={userFlagged} />
                </div>

                {comment.owner && <CommentDelete handleDeletion={handleDeletion} userDeleted={userDeleted} />}
            </div>

            {(replyForm && !userDeleted) &&
                <CommentReply
                    id={comment._id}
                    type="comment"
                    username={comment.user.username}
                    handleNewReply={(newReplies: Reply[]) => handleNewReply(newReplies)}
                />
            }

            {(newReply !== null && !showReplies) && (
                <div className="mt-2 pl-2">
                    {newReply.map((reply) => (
                        <ReplyCard key={reply._id} reply={reply} />
                    ))}
                </div>
            )}

            {/* Replies */}
            <section>
                {comment.replies > 0 && !showReplies &&
                    <div onClick={() => setShowReplies(true)} className="flex items-center gap-x-1 mt-4 font-semibold text-[10px] md:text-[11px] xl:text-xs cursor-pointer montserrat">
                        <ArrowDown2 className="size-4 md:size-4.5 xl:size-5" variant="Bold" />
                        <span>View {comment.replies} {comment.replies === 1 ? "Reply" : "Replies"}</span>
                    </div>
                }
                {showReplies && (
                    <div className="mt-2 pl-2 max-h-[30rem] overflow-y-auto hide-scrollbar" ref={scrollRef}>
                        {isLoading && (
                            <div className="space-y-4">
                                {Array.from({ length: 2 }).map((_, i) => (
                                    <CommentLoader key={i} />
                                ))}
                            </div>
                        )}

                        {(!isLoading && replies.length === 0) &&
                            <div className="py-10 text-center">
                                No replies yet.
                            </div>
                        }

                        {replies.map((reply) => (
                            <ReplyCard key={reply._id} reply={reply} />
                        ))}


                        {/* Intersection trigger */}
                        <div ref={loadMoreRef} />
                    </div>
                )}
                {showReplies &&
                    <div onClick={() => setShowReplies(false)} className="flex items-center gap-x-1 mt-4 font-semibold text-[10px] md:text-[11px] hover:text-destructive xl:text-xs cursor-pointer montserrat">
                        <ArrowUp2 className="size-4 md:size-4.5 xl:size-5" variant="Bold" />
                        <span>Close {comment.replies === 1 ? "Reply" : "Replies"}</span>
                    </div>
                }
            </section>
        </main>
    );
};

export default CommentCard;