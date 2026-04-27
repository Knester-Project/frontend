import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Utils and Services
import { cn } from "@/lib/utils";
import { dateConverter, detectMediaType } from "@/utils/format";
import { useFlagPost } from "@/services/userMutations";

// UIs
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MediaGrid } from "@/components/MediaGrid";
import Vibe from "@/components/Vibe";
import Comment from "@/components/Comment";
import Views from "@/components/Views";
import ShareMenu from "@/components/Share";

// Icons
import { Pencil, ChevronDown } from "lucide-react";
import { Flag, Verify } from "iconsax-reactjs";



// Thread Continuation Bubble
function ThreadBubble({ post }: { post: Post }) {
    return (
        <div className="flex gap-3 mt-3 pt-3 border-border/30 border-t">
            <div className="flex flex-col items-center">
                <div className="flex-1 bg-border/50 w-px" />
            </div>
            <div className="flex-1 pb-1 min-w-0">
                <p className="text-foreground/85 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                </p>
                <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-3">
                        <Vibe handleToggle={() => { }} userVibed={post.hasVibed} vibes={post.vibes} />
                        <Comment postId={post._id} comments={post.comments} postModel="Post" />
                    </div>
                    <Views views={post.views} />
                </div>
            </div>
        </div>
    );
}

// Main PostCard 
export default function PostCard({ post, index = 0 }: { post: Post; index?: number }) {


    // State initialization derived directly from the post data
    const [vibed, setVibed] = useState<boolean>(post.hasVibed);
    const [userFlagged, setUserFlagged] = useState<boolean>(post.hasFlagged);
    const [threadExpanded, setThreadExpanded] = useState<boolean>(false);

    // Constants
    const timeAgo = dateConverter(post.createdAt)
    const hasThread = post.isThread && post.thread && post.thread.length > 0;
    const gallery = post.media.map((url) => ({
        url,
        type: detectMediaType(url),
    }));

    // Functions
    const handleVibe = () => {
        setVibed((v) => !v);

        // TODO: Add your React Query mutation here (e.g., usePostVibe)
        // just like you did in the SafetyPost component!
    };

    const flagPost = useFlagPost(post._id, { state: "", city: "", street: "", name: "", limit: 2 })
    const handleFlagged = () => {
        if (userFlagged) return;
        setUserFlagged(true);
        flagPost.mutate({ postId: post._id, postModel: "SafetyPost" }, {
            onError: () => {
                setUserFlagged(false);
            },
        });
    }


    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06, duration: 0.3 }}
            className="bg-card shadow-sm hover:shadow-md border border-border/60 hover:border-border/80 rounded-2xl overflow-hidden transition-all duration-200">
            <div className="p-4">
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
                <div className="flex justify-between items-start gap-3">
                    <div className="flex items-center gap-2.5">
                        <Avatar className="rounded-xl w-9 h-9 shrink-0">
                            <AvatarImage src={post.user?.profile?.profilePicture} />
                            <AvatarFallback className="bg-primary/10 rounded-xl font-semibold text-primary text-xs">
                                {post.user?.username?.slice(0, 2).toUpperCase() || "??"}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-[11px] md:text-xs xl:text-sm leading-none">
                                    {post.user?.username || "user"}
                                </span>
                                {post.user?.isPremium && (
                                    <span className="inline-flex items-center gap-0.5 bg-premium/10 px-1.5 py-0.5 rounded-md font-bold text-[8px] text-premium md:text-[9px] xl:text-[10px] uppercase tracking-wide">
                                        <Verify className="size-2.5" /> Pro
                                    </span>
                                )}
                                {post.user?.isCore && (
                                    <span className="bg-core/10 px-1.5 py-0.5 rounded-md font-bold text-[8px] text-core md:text-[9px] xl:text-[10px] uppercase tracking-wide">
                                        Core
                                    </span>
                                )}
                                {post.user?.isModerator && (
                                    <span className="bg-moderator/10 px-1.5 py-0.5 rounded-md font-bold text-[8px] text-moderator md:text-[9px] xl:text-[10px] uppercase tracking-wide">
                                        Core
                                    </span>
                                )}
                            </div>
                            <p className="mt-0.5 text-[10px] text-gray-600 md:text-[11px] dark:text-gray-400 text-xs">{timeAgo}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                        {post.edited && (
                            <span className="flex items-center gap-1 text-[9px] text-gray-600 md:text-[10px] xl:text-[11px] dark:text-gray-400/60">
                                <Pencil className="size-2.5" /> edited
                            </span>
                        )}
                        <button onClick={handleFlagged} className={`flex items-center gap-1 duration-500 bg-white/40 dark:bg-white/10 backdrop-blur-md px-3 py-1 rounded-xl 
                                            ${userFlagged ? "text-destructive cursor-not-allowed" : "hover:text-destructive cursor-pointer"}`}>
                            <Flag variant="Bold" className={`size-5`} />
                            <span>{userFlagged ? "Flagged" : "Flag"}</span>
                        </button>
                    </div>
                </div>

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
                                {post.thread!.map((child) => (
                                    <ThreadBubble key={child._id} post={child} />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}

                {/* Thread Toggle Button */}
                <div className={`flex mt-3 ${hasThread ? "justify-between" : "justify-end"}`}>
                    {hasThread && (
                        <button onClick={() => setThreadExpanded((v) => !v)}
                            className="flex items-center gap-1.5 font-semibold text-[11px] text-primary/70 hover:text-primary transition-colors cursor-pointer montserrat">
                            <ChevronDown className={cn("size-3.5 transition-transform", threadExpanded && "rotate-180")} />
                            {threadExpanded ? "Collapse thread" : `Read ${post.thread!.length} more in thread`}
                        </button>
                    )}
                    <Views views={post.views} />
                </div>

            </div>

            {/* Reusable Components Action Bar */}
            <div className="flex justify-between items-center bg-accent/40 dark:bg-accent/20 px-4 py-2 border-border/30 border-t">
                <div className="flex items-center gap-4">
                    <Vibe handleToggle={handleVibe} userVibed={vibed} vibes={post.vibes} />
                    <Comment postId={post._id} comments={post.comments} postModel="Post" />
                </div>

                <div className="flex items-center gap-4">
                    <ShareMenu title="Post" text="Check out this post" route={`/post/${post.postId}`} />
                </div>
            </div>
        </motion.div>
    );
}