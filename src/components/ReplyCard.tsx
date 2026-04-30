import { useState, useRef } from "react";
import { Link } from "@tanstack/react-router";

// Utils, Services, Hooks and Constants
import { dateConverter } from "@/utils/format";
import { useDeleteReply, useFlagReply, useReplyVibe } from "@/services/userMutations";
import { useReplies } from "@/services/userQueries";
import useInfiniteScroll from "@/Hooks/useInfiniteScroll";
import { REPLIES_LIMIT } from "@/assets/constants";

// UIs
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CommentVibe from "./CommentVibe";
import CommentReplyBtn from "./CommentReplyBtn";
import CommentFlag from "./CommentFlag";
import CommentDelete from "./CommentDelete";

// Icons
import { ArrowDown2, ArrowUp2, Lock, Verify } from "iconsax-reactjs";
import CommentLoader from "./CommentLoader";
import CommentReply from "./CommentReply";

const ReplyCard = ({ reply }: { reply: Reply }) => {

    const [showReplies, setShowReplies] = useState<boolean>(false);
    const [userVibed, setUserVibed] = useState<boolean>(reply.hasVibed);
    const [userFlagged, setUserFlagged] = useState<boolean>(reply.hasFlagged);
    const [userDeleted, setUserDeleted] = useState<boolean>(reply.isDeleted);
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

    const toggleVibe = useReplyVibe(reply._id, { id: reply._id, type: "reply", limit: REPLIES_LIMIT });
    const handleToggle = () => {
        if (userDeleted) return;
        setUserVibed((prev) => !prev);
        toggleVibe.mutate({ postId: reply._id, postModel: "Reply" }, {
            onError: () => {
                setUserVibed((prev) => !prev);
            },
        });
    }

    const flagReply = useFlagReply(reply._id, { id: reply._id, type: "reply", limit: REPLIES_LIMIT })
    const handleFlagged = () => {
        if (userDeleted) return;
        if (userFlagged) return;
        setUserFlagged(true);
        flagReply.mutate({ postId: reply._id, postModel: "Reply" }, {
            onError: () => {
                setUserFlagged(false);
            },
        });
    }

    const deleteReply = useDeleteReply(reply._id, { id: reply._id, type: "reply", limit: REPLIES_LIMIT });
    const handleDeletion = () => {
        if (userDeleted) return;
        setUserDeleted(true);
        deleteReply.mutate(reply._id, {
            onError: () => {
                setUserFlagged(false);
            },
        });
    }

    // Replies Query
    const { data, fetchNextPage, isLoading, hasNextPage, isFetchingNextPage } = useReplies({ id: reply._id, type: "reply", limit: REPLIES_LIMIT }, showReplies);
    const replies = data?.pages.flatMap((page) => page.data.replies) ?? [];

    // Scroll Ref and Infinite Scroll for Replies
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const loadMoreRef = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage, root: scrollRef.current });

    return (
        <main className={`mb-2 p-2 md:p-3 xl:p-4 rounded-3xl`}>
            {/* Header */}
            <header>
                <div className="flex items-center gap-x-2">
                    {/* Avatar Section */}
                    <Link disabled={reply.user.profile?.profileLock} to="/profile" search={{ profile: reply.owner ? "me" : reply.user.username }}>
                        <Avatar className="shadow-sm border border-white/10 size-8 md:size-9 xl:size-10">
                            <AvatarImage src={reply.user.profile?.profilePicture} />
                            <AvatarFallback className="bg-primary/10 font-bold text-primary">
                                {reply.user.username.slice(0, 2).toUpperCase() || "??"}
                            </AvatarFallback>
                        </Avatar>
                    </Link>

                    {/* Text & Badges Section */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-x-1">
                            <p className="font-semibold leading-none">
                                {reply.user.username}
                            </p>
                            {reply.user.profile?.profileLock && (
                                <Lock variant="Bold" className="size-3.5 md:size-4 xl:size-4.5 text-foreground/60" />
                            )}
                            {reply.user.isPremium && (
                                <Verify variant="Bold" className="size-3.5 md:size-4 xl:size-4.5 text-premium" />
                            )}
                            {reply.user.isModerator && (
                                <Verify variant="Bold" className="size-3.5 md:size-4 xl:size-4.5 text-moderator" />
                            )}
                            {reply.user.isCore && (
                                <Verify variant="Bold" className="size-3.5 md:size-4 xl:size-4.5 text-core" />
                            )}
                        </div>

                        <p className="font-medium text-[10px] text-gray-400 md:text-xs tracking-wide">
                            {dateConverter(reply.createdAt)}
                        </p>
                    </div>
                </div>
            </header>

            {/* Content */}
            <section className="my-2">
                <p className={userDeleted ? "text-red-600 dark:text-red-300 italic" : ""}>{reply.content}</p>
            </section>

            {/* Actions */}
            <div className="flex justify-between mt-3">

                <div className="flex items-start gap-2">
                    <CommentVibe handleToggle={handleToggle} userVibed={userVibed} vibes={reply.vibes} />

                    <CommentReplyBtn toggleForm={toggleForm} replyForm={replyForm} replies={reply.replies} />

                    <CommentFlag handleFlagging={handleFlagged} userFlagged={userFlagged} />
                </div>

                {reply.owner && <CommentDelete handleDeletion={handleDeletion} userDeleted={userDeleted} />}
            </div>

            {(replyForm && !userDeleted) &&
                <CommentReply
                    id={reply._id}
                    type="reply"
                    username={reply.user.username}
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
                {reply.replies > 0 && !showReplies &&
                    <div onClick={() => setShowReplies(true)} className="flex items-center gap-x-1 mt-4 font-semibold text-[10px] md:text-[11px] xl:text-xs cursor-pointer montserrat">
                        <ArrowDown2 className="size-4 md:size-4.5 xl:size-5" variant="Bold" />
                        <span>View {reply.replies} {reply.replies === 1 ? "Reply" : "Replies"}</span>
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
                        <div ref={loadMoreRef} className="w-full h-4" />
                    </div>
                )}
                {showReplies &&
                    <div onClick={() => setShowReplies(false)} className="flex items-center gap-x-1 mt-4 font-semibold text-[10px] md:text-[11px] hover:text-destructive xl:text-xs cursor-pointer montserrat">
                        <ArrowUp2 className="size-4 md:size-4.5 xl:size-5" variant="Bold" />
                        <span>Close {reply.replies === 1 ? "Reply" : "Replies"}</span>
                    </div>
                }
            </section>
        </main>
    );
}

export default ReplyCard;