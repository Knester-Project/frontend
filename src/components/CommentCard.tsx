import { useState } from "react";

// Utils and Services
import { dateConverter, detectMediaType } from "@/utils/format";
import { useCommentVibe, useFlagComment } from "@/services/userMutations";

// UIs
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MediaGrid } from "./MediaGrid";
import Views from "./Views";
import CommentVibe from "./CommentVibe";

// Icons
import { ArrowDown2, Messages2 } from "iconsax-reactjs";
import CommentFlag from "./CommentFlag";

const CommentCard = ({ comment }: { comment: PostComment }) => {

    const [showReplies, setShowReplies] = useState<boolean>(false);
    const [userVibed, setUserVibed] = useState<boolean>(comment.hasVibed);
    const [userFlagged, setUserFlagged] = useState<boolean>(comment.hasFlagged);

    // Functions

    const toggleVibe = useCommentVibe(comment._id, { postId: comment.post, limit: 4 });
    const handleToggle = () => {
        setUserVibed((prev) => !prev);
        toggleVibe.mutate({ postId: comment._id, postModel: "Comment" }, {
            onError: () => {
                setUserVibed((prev) => !prev);
            },
        });
    }

    const flagComment = useFlagComment(comment._id, { postId: comment.post, limit: 4 })
    const handleFlagged = () => {
        if (userFlagged) return;
        setUserFlagged(true);
        flagComment.mutate({ postId: comment._id, postModel: "Comment" }, {
            onError: () => {
                setUserFlagged(false);
            },
        });
    }

    return (
        <main className="bg-accent/20 shadow-sm mb-2 p-4 md:p-5 xl:p-6 border border-border rounded-3xl">
            {/* Header */}
            <header className="flex justify-between items-center">
                <div className="flex items-center gap-x-2">
                    <Avatar>
                        <AvatarImage src={comment.user.profile?.profilePicture ?? "/default.svg"} />
                        <AvatarFallback>
                            {comment.user.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{comment.user.username}</p>
                        <p className="text-gray-400 text-xs md:text-sm">
                            {dateConverter(comment.createdAt)}
                        </p>
                    </div>
                </div>

                {/* Views */}
                <Views views={comment.views} />
            </header>

            {/* Content */}
            <section className="mt-2">
                <p className="mb-2">{comment.content}</p>
                {comment.media && (
                    <MediaGrid media={[{ url: comment.media, type: detectMediaType(comment.media) }]} />
                )}
            </section>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-3 -ml-1">

                {/* Vibe */}
                <CommentVibe handleToggle={handleToggle} userVibed={userVibed} vibes={comment.vibes} />

                {/* Replies */}
                <button className={`flex items-center gap-1.5 bg-white/7 rounded-full cursor-pointer border border-border hover:bg-comment-active/5 hover:border-comment-active backdrop-blur-md px-3 py-1.5 hover:text-comment-active transition-all duration-200`}>
                    <Messages2 className="size-4" />
                    <span className="font-medium montserrat">{comment.replies}</span>
                </button>

                {/* Flag */}
                <CommentFlag handleFlagging={handleFlagged} userFlagged={userFlagged} />
            </div>

            {/* Replies */}
            <section>
                {comment.replies > 0 && !showReplies &&
                    <div onClick={() => setShowReplies(true)} className="flex items-center gap-x-1 my-4 font-semibold cursor-pointer montserrat">
                        <ArrowDown2 className="size-4 md:size-4.5 xl:size-5" variant="Bold" />
                        <span>View {comment.replies} Replies</span>
                    </div>
                }
            </section>
        </main>
    );
};

export default CommentCard;