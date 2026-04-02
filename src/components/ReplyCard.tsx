import { useState } from "react";

// Utils and Services
import { dateConverter } from "@/utils/format";
import { useDeleteReply, useFlagReply, useReplyVibe } from "@/services/userMutations";

// UIs
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CommentVibe from "./CommentVibe";
import CommentReplyBtn from "./CommentReplyBtn";
import CommentFlag from "./CommentFlag";
import CommentDelete from "./CommentDelete";

// Icons
import { Lock, Verify } from "iconsax-reactjs";

const ReplyCard = ({ reply }: { reply: Reply }) => {

    const [userVibed, setUserVibed] = useState<boolean>(reply.hasVibed);
    const [userFlagged, setUserFlagged] = useState<boolean>(reply.hasFlagged);
    const [userDeleted, setUserDeleted] = useState<boolean>(reply.isDeleted);
    const [replyForm, setReplyForm] = useState<boolean>(false);


    // Functions
    const toggleForm = () => {
        if (userDeleted) return;
        setReplyForm((prev) => !prev);
    }

    const toggleVibe = useReplyVibe(reply._id, { id: reply._id, type: "reply", limit: 4 });
    const handleToggle = () => {
        if (userDeleted) return;
        setUserVibed((prev) => !prev);
        toggleVibe.mutate({ postId: reply._id, postModel: "Reply" }, {
            onError: () => {
                setUserVibed((prev) => !prev);
            },
        });
    }

    const flagReply = useFlagReply(reply._id, { id: reply._id, type: "reply", limit: 4 })
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

    const deleteReply = useDeleteReply(reply._id, { id: reply._id, type: "reply", limit: 4 });
    const handleDeletion = () => {
        if (userDeleted) return;
        setUserDeleted(true);
        deleteReply.mutate(reply._id, {
            onError: () => {
                setUserFlagged(false);
            },
        });
    }

    return (
        <main className={`${reply.owner ? "border-accent" : "border-border"} mb-2 p-2 md:p-3 xl:p-4 border rounded-3xl`}>
            {/* Header */}
            <header>
                <div className="flex items-center gap-x-2">
                    {/* Avatar Section */}
                    <Avatar className="shadow-sm border border-white/10 size-8 md:size-9 xl:size-10">
                        <AvatarImage src={reply.user.profile?.profilePicture ?? "/default.svg"} />
                        <AvatarFallback className="bg-primary/10 font-bold text-primary">
                            {reply.user.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

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
        </main>
    );
}

export default ReplyCard;