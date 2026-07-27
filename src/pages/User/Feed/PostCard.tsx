import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Utils, Services and Constants
import { cn } from "@/lib/utils";
import { dateConverter, detectMediaType } from "@/utils/format";
import { usePostVibe, usePostFlag } from "@/services/userMutations";
import { POST_LIMIT } from "@/assets/constants";

// UIs
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MediaGrid } from "@/components/MediaGrid";
import Vibe from "@/components/Vibe";
import Comment from "@/components/Comment";
import Views from "@/components/Views";
import ShareMenu from "@/components/Share";

// Icons
import { ChevronDown } from "lucide-react";
import { Edit, Flag, Verify } from "iconsax-reactjs";
import EditPost from "./PostEdit";
import { Link } from "@tanstack/react-router";



// Thread Continuation Bubble
function ThreadBubble({ post, isOwner = false, nextCursor = null }: { post: Post, isOwner?: boolean, nextCursor?: string | null, }) {

    const [edit, setEdit] = useState<boolean>(false);

    // Constants
    const gallery = post.media.map((url) => ({
        url,
        type: detectMediaType(url),
    }));

    // Functions
    const toggleEdit = () => setEdit((prev) => !prev);

    return (
        <>
            {edit ?
                <EditPost post={post} onClose={toggleEdit} nextCursor={nextCursor} />
                :
                <main className="relative mt-2 pl-8">
                    {/* Thread line */}
                    <div className="top-0 bottom-0 left-3 absolute bg-border w-px" />

                    {/* Horizontal connector */}
                    <div className="top-6 left-3 absolute bg-border w-5 h-px" />

                    <article className="bg-accent/10 p-4 border border-accent/10 rounded-xl">
                        {/* Editing */}
                        <section className="flex justify-end gap-x-2">
                            {post.edited && (
                                <div className="inline-flex items-center gap-x-1 text-[9px] text-gray-600 md:text-[10px] xl:text-[11px] dark:text-gray-400/60">
                                    <Edit className="size-2.5 md:size-3 xl:size-3.5" />
                                    <span>edited</span>
                                </div>
                            )}

                            {isOwner &&
                                <button onClick={toggleEdit} className="flex items-center gap-x-1 mb-1 hover:text-blue-500 duration-500 cursor-pointer">
                                    <Edit variant="Bold" className={`size-3 md:size-3.5 xl:size-4`} />
                                    <span className="text-[10px] md:text-[11px] xl:text-xs">Edit</span>
                                </button>
                            }
                        </section>
                        <section className="flex-1 mt-2 pb-1 min-w-0">
                            <p className="mb-2 text-[11px] text-foreground/85 md:text-xs xl:text-sm leading-relaxed whitespace-pre-wrap">
                                {post.content}
                            </p>

                            {/* Media Grid */}
                            {post.media && post.media.length > 0 && (
                                <MediaGrid media={gallery} />
                            )}

                            <div className="flex justify-between items-center mt-2">
                                <Comment postId={post._id} comments={post.comments} postModel="Post" />
                                <Views views={post.views} />
                            </div>
                        </section>
                    </article>
                </main>
            }
        </>
    );
}

type PostCardProps = {
    post: Post,
    index?: number,
    nextCursor?: string | null,
    isOwner?: boolean,
}

// Main PostCard 
export default function PostCard({ post, index = 0, nextCursor = null, isOwner = false }: PostCardProps) {

    const [edit, setEdit] = useState<boolean>(false)
    const [vibed, setVibed] = useState<boolean>(post.hasVibed);
    const [userFlagged, setUserFlagged] = useState<boolean>(post.hasFlagged);
    const [threadExpanded, setThreadExpanded] = useState<boolean>(false);

    // Constants
    const timeAgo = post.edited ? dateConverter(post.updatedAt) : dateConverter(post.createdAt);
    const hasThread = post.isThread && post.thread && post.thread.length > 0;
    const gallery = post.media.map((url) => ({
        url,
        type: detectMediaType(url),
    }));

    // Functions
    const toggleVibe = usePostVibe(post._id, "feed", { limit: POST_LIMIT })
    const handleVibe = () => {
        setVibed((prev) => !prev);
        toggleVibe.mutate({ postId: post._id, postModel: "Post" }, {
            onError: () => {
                setVibed((prev) => !prev);
            }
        });
    };

    const flagPost = usePostFlag(post._id, "feed", { limit: POST_LIMIT })
    const handleFlagged = () => {
        if (userFlagged) return;
        setUserFlagged(true);
        flagPost.mutate({ postId: post._id, postModel: "Post" }, {
            onError: () => {
                setUserFlagged(false);
            },
        });
    }

    // Toggle Edit
    const toggleEdit = () => setEdit((prev) => !prev);

    return (
        <>
            {edit ? <EditPost post={post} onClose={toggleEdit} nextCursor={nextCursor} />
                :
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06, duration: 0.3 }}
                    className="relative bg-card shadow-sm hover:shadow-md border border-border/60 hover:border-border/80 rounded-2xl h-fit overflow-hidden transition-all duration-200">

                    <main className="p-4 pb-14 overflow-y-auto hide-scrollbar">
                        {/* Thread badge */}
                        {post.isThread && (
                            <div className="flex items-center gap-1.5 mb-2.5">
                                <div className="flex gap-0.5">
                                    {[0, 1, 2].map((i) => (
                                        <div key={i} className="bg-primary/50 rounded-full size-1" style={{ opacity: 1 - i * 0.25 }} />
                                    ))}
                                </div>
                                <span className="font-semibold text-[10px] text-primary/60 uppercase tracking-widest">Thread</span>
                            </div>
                        )}

                        {/* Author row */}
                        <section className="flex justify-between items-start gap-3">
                            <div className="flex items-center gap-2.5">
                                <Link disabled={post.user.profile?.profileLock} to="/profile" search={{ profile: post.user.username }}>
                                    <Avatar className="rounded-md size-9 shrink-0">
                                        <AvatarImage src={post.user?.profile?.profilePicture} />
                                        <AvatarFallback className="bg-primary/10 rounded-md font-semibold text-primary text-xs">
                                            {post.user?.username?.slice(0, 2).toUpperCase() || "??"}
                                        </AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <div className="flex items-center gap-x-1.5">
                                        <Link to="/profile" disabled={post.user.profile?.profileLock} search={{ profile: post.user.username }} className="font-semibold text-[11px] md:text-xs xl:text-sm leading-none">
                                            {post.user?.username || "user"}
                                        </Link>

                                        {post.user?.isPremium && (
                                            <div className="inline-flex items-center gap-0.5 bg-premium/10 px-1.5 py-0.5 rounded-md font-bold text-[8px] text-premium md:text-[9px] xl:text-[10px] uppercase tracking-wide">
                                                <Verify className="size-2.5 md:size-3 xl:size-3.5" /> Pro
                                            </div>
                                        )}
                                        {post.user?.isCore && (
                                            <div className="bg-core/10 px-1.5 py-0.5 rounded-md font-bold text-[8px] text-core md:text-[9px] xl:text-[10px] uppercase tracking-wide">
                                                <Verify className="size-2.5 md:size-3 xl:size-3.5" />
                                                Core
                                            </div>
                                        )}
                                        {post.user?.isModerator && (
                                            <div className="bg-moderator/10 px-1.5 py-0.5 rounded-md font-bold text-[8px] text-moderator md:text-[9px] xl:text-[10px] uppercase tracking-wide">
                                                <Verify className="size-2.5 md:size-3 xl:size-3.5" />
                                                Moderator
                                            </div>
                                        )}
                                        {post.edited && (
                                            <div className="inline-flex items-center gap-x-1 text-[9px] text-gray-600 md:text-[10px] xl:text-[11px] dark:text-gray-400/60">
                                                <Edit className="size-2.5 md:size-3 xl:size-3.5" />
                                                <span>edited</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="mt-0.5 text-[10px] text-gray-600 md:text-[11px] dark:text-gray-400 text-xs">{timeAgo}</p>
                                </div>
                            </div>

                            {/* Flagging and Editing */}
                            <div className="flex gap-x-3">
                                <button onClick={handleFlagged} className={`flex items-center gap-1 duration-500 bg-white/40 dark:bg-white/10 backdrop-blur-md px-3 py-1 rounded-xl ${userFlagged ? "text-destructive cursor-not-allowed" : "hover:text-destructive cursor-pointer"}`}>
                                    <Flag variant="Bold" className={`size-4 md:size-4.5 xl:size-5`} />
                                    <span>{userFlagged ? "Flagged" : "Flag"}</span>
                                </button>

                                {isOwner &&
                                    <button onClick={toggleEdit} className="flex items-center gap-1 bg-white/40 dark:bg-white/10 backdrop-blur-md px-3 py-1 rounded-xl hover:text-blue-500 duration-500 cursor-pointer">
                                        <Edit variant="Bold" className={`size-4 md:size-4.5 xl:size-5`} />
                                        <span>Edit</span>
                                    </button>
                                }
                            </div>
                        </section>

                        {/* Content */}
                        <p className="my-3 text-[11px] text-foreground/90 md:text-xs xl:text-sm leading-relaxed whitespace-pre-wrap">
                            {post.content}
                        </p>

                        {/* Media Grid */}
                        {post.media && post.media.length > 0 && (
                            <MediaGrid media={gallery} />
                        )}

                        {/* Hashtags */}
                        {post.hashtags && post.hashtags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                                {post.hashtags.map((tag) => (
                                    <span key={tag} className="font-medium text-[10px] text-primary/70 md:text-[11px] hover:text-primary text-xs transition-colors cursor-pointer">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Thread Expansion Panel */}
                        {hasThread && (
                            <AnimatePresence initial={false}>
                                {threadExpanded && (
                                    <motion.div key="thread" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                                        {post.thread?.map((child) => (
                                            <ThreadBubble key={child._id} post={child} isOwner={isOwner} />
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}

                        {/* Thread Toggle Button */}
                        <section className={`flex mt-3 ${hasThread ? "justify-between" : "justify-end"}`}>
                            {hasThread && (
                                <button onClick={() => setThreadExpanded((v) => !v)}
                                    className="flex items-center gap-1.5 font-semibold text-[11px] text-primary/70 hover:text-primary transition-colors cursor-pointer montserrat">
                                    <ChevronDown className={cn("size-3.5 transition-transform", threadExpanded && "rotate-180")} />
                                    {threadExpanded ? "Collapse thread" : `Read ${post.thread!.length} more in thread`}
                                </button>
                            )}
                            <Views views={post.views} />
                        </section>

                    </main>

                    {/* Reusable Components Action Bar */}
                    <div className="bottom-0 z-2 absolute flex justify-between items-center bg-accent/40 dark:bg-accent/20 px-4 py-2 border-border/30 border-t w-full">
                        <div className="flex items-center gap-4">
                            <Vibe handleToggle={handleVibe} userVibed={vibed} vibes={post.vibes} />
                            <Comment postId={post._id} comments={post.comments} postModel="Post" />
                        </div>

                        <div className="flex items-center gap-4">
                            <ShareMenu title="Post" text="Check out this post" route={`/post/${post.postId}`} />
                        </div>
                    </div>
                </motion.div>
            }
        </>
    );
}