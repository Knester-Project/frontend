import { useState } from "react";

// Utils
import { dateConverter, detectMediaType } from "@/utils/format";

// UIs
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MediaGrid } from "./MediaGrid";
import Views from "./Views";

// Icons
import { ArrowDown2, Flag, Heart, Messages2 } from "iconsax-reactjs";

const CommentCard = ({ comment }: { comment: PostComment }) => {

    const [showReplies, setShowReplies] = useState<boolean>(false);

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
                <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full 
                    backdrop-blur-md transition-all duration-200 cursor-pointer 
                    ${comment.hasVibed ? 'text-vibe bg-vibe/10' : 'bg-white/7 border border-border hover:bg-vibe-active/5 hover:border-vibe-active hover:text-vibe-active'} `}>
                    <Heart className="size-4" variant={comment.hasVibed ? "Bold" : "Outline"} />
                    <span className="font-medium montserrat">{comment.vibes}</span>
                </button>

                {/* Replies */}
                <button className={`flex items-center gap-1.5 bg-white/7 rounded-full cursor-pointer border border-border hover:bg-comment-active/5 hover:border-comment-active backdrop-blur-md px-3 py-1.5 hover:text-comment-active transition-all duration-200`}>
                    <Messages2 className="size-4" />
                    <span className="font-medium montserrat">{comment.replies}</span>
                </button>

                {/* Report */}
                <button title="Report this comment" className="flex justify-center items-center bg-white/7 hover:bg-destructive/5 backdrop-blur-md px-3 py-1.5 border border-border hover:border-destructive rounded-full hover:text-destructive transition-all duration-200 cursor-pointer">
                    <Flag className="size-4" />
                </button>
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