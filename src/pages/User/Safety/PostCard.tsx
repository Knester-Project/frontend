import { useState } from "react";
import { Route } from "@/routes/_dashboard/safety";

// Utils and Services
import { dateConverter, detectMediaType } from "@/utils/format";
import { useSafetyPostVibe, useFlagPost } from "@/services/userMutations";

// UIs
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ShareMenu from "@/components/Share";
import Vibe from "@/components/Vibe";
import { MediaGrid } from "@/components/MediaGrid";
import Comment from "@/components/Comment";
import Views from "@/components/Views";

// Icons
import { Verify, Flag, Location, Calendar1 } from "iconsax-reactjs"


const PostCard = ({ post }: { post: SafetyPost }) => {

    const { state, city, street, name } = Route.useSearch();
    const [expanded, setExpanded] = useState<boolean>(false);
    const { fullName, createdAt, dateOfIncident, content, verified, vibes, comments, hasFlagged, hasVibed, views, location, media, socialMedia, postId } = post;
    const [userVibed, setUserVibed] = useState<boolean>(hasVibed);
    const [userFlagged, setUserFlagged] = useState<boolean>(hasFlagged);

    // Constants
    const locationText = [location?.street, location?.town, location?.city, location?.state].filter(Boolean).join(", ");
    const gallery = media.map(({ url }) => ({
        url,
        type: detectMediaType(url),
    }));

    // Functions
    const toggleVibe = useSafetyPostVibe(post._id, { state, city, street, name, limit: 2 })
    const handleToggle = () => {
        setUserVibed((prev) => !prev);
        toggleVibe.mutate({ postId: post._id, postModel: "SafetyPost" }, {
            onError: () => {
                setUserVibed((prev) => !prev);
            },
        });
    }

    const flagPost = useFlagPost(post._id, { state, city, street, name, limit: 2 })
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
        <main className="bg-accent/20 dark:bg-accent/5 shadow-sm mb-4 p-4 md:p-5 xl:p-6 border border-border rounded-3xl">

            {/* Header */}
            <header className="flex justify-between items-start mb-4">
                <div className="flex flex-1 items-start gap-3">
                    <Avatar>
                        <AvatarImage src={media?.[0]?.url} />
                        <AvatarFallback>
                            {fullName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-x-1">
                            <h3 className="font-bold text-sm md:text-base xl:text-lg truncate">
                                {fullName}
                            </h3>
                            {verified && (
                                <Verify variant={`${verified ? "Bold" : "Outline"}`} className="size-5 text-safety" />
                            )}
                        </div>

                        <p className="text-gray-400 text-xs md:text-sm">
                            {dateConverter(createdAt)}
                        </p>
                    </div>
                </div>

                <button onClick={handleFlagged} className={`flex items-center gap-1 bg-white/40 dark:bg-white/10 backdrop-blur-md px-3 py-1 rounded-xl 
                    ${userFlagged ? "text-destructive cursor-not-allowed" : "hover:text-destructive cursor-pointer"}`}>
                    <Flag variant="Bold" className={`size-5`} />
                    <span>{userFlagged ? "Flagged" : "Flag"}</span>
                </button>
            </header>

            {/* Location */}
            <section className="flex flex-wrap gap-3 mb-4 text-gray-400 text-xs md:text-sm">
                <div className="flex gap-1">
                    <Location className="size-4" />
                    <span>{locationText}</span>
                </div>

                <div className="flex items-center gap-1">
                    <Calendar1 className="size-4" />
                    <span>{dateConverter(dateOfIncident)}</span>
                </div>
            </section>

            {/* Content */}
            <div className="mb-4">
                <p className={`leading-relaxed ${expanded ? "" : "line-clamp-3 lg:line-clamp-none"}`}>
                    {content}
                </p>

                {!expanded && (
                    <button onClick={() => setExpanded(true)} className="lg:hidden mt-1 text-primary text-xs hover:underline cursor-pointer">
                        Show more
                    </button>
                )}

                {expanded && (
                    <button onClick={() => setExpanded(false)} className="lg:hidden mt-1 text-primary text-xs hover:underline cursor-pointer">
                        Close
                    </button>
                )}
            </div>

            {/* Media */}
            {media.length > 0 && <MediaGrid media={gallery} />}

            {/* Social Media */}
            {socialMedia?.length > 0 && (
                <div className="bg-accent/20 mb-4 p-3 border border-border rounded-xl">
                    {socialMedia.map((item, i) => (
                        <a key={i} href={item.profileLink} target="_blank" className="flex justify-between items-center text-sm hover:underline">
                            <span className="font-medium">{item.platform}</span>
                            <span className="text-muted">@{item.username}</span>
                        </a>
                    ))}
                </div>
            )}

            {/* Views */}
            <div className="flex justify-between">
                {vibes === 1 && hasVibed ? (
                    <p>You vibed with this</p>
                ) : vibes > 0 && hasVibed ? (
                    <p>You and {vibes} people vibed with this</p>
                ) : vibes > 0 ? (
                    <p>{vibes} people vibed with this</p>
                ) : null}
                <Views views={views} />
            </div>

            {/* Actions */}
            <footer className="flex justify-between items-center pt-3 border-t text-muted">
                <Vibe handleToggle={handleToggle} userVibed={userVibed} vibes={vibes} />

                <Comment postId={post._id} comments={comments} postModel={"SafetyPost"} />

                <ShareMenu title="Safety Post" text="Check out this safety report" route={`/safety/${postId}`} />
            </footer>
        </main>
    );
};

export default PostCard;