import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";

// Stores and Utils
import { useProfileTheme } from "@/stores/profileTheme.store";
import { cn } from "@/lib/utils";

// UIs
import MediaGallery from "./MediaGallery";
import AccountStatus from "./AccountStatus";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Cobweb from "@/components/Cobweb";

// Icons
import { TagUser, ShieldSecurity, Gallery, Slash, MedalStar, Crown1, Star1, Shop, ReceiptText } from "iconsax-reactjs";

type bodyProps = {
    media: string[];
    isOwner: boolean;
    username: string;
    invitedUser: User[];
    isEmailVerified: boolean;
    profileLock: boolean;
    chatLock: boolean;
    discoverable: boolean;
    flagged: boolean;
    isSuspended: boolean;
    referralPrivilege: number;
    dateOfBirth: string;
    email: string;
    createdAt: string;
}

const TABS = [
    { id: "account", label: "Account", icon: TagUser },
    { id: "post", label: "Posts", icon: ReceiptText },
    { id: "advert", label: "Adverts", icon: Shop },
] as const;

type TabId = (typeof TABS)[number]["id"];

const Body = ({
    media, isOwner, username, invitedUser, isEmailVerified, profileLock, chatLock, discoverable,
    flagged, isSuspended, referralPrivilege, dateOfBirth, email, createdAt
}: bodyProps) => {

    const { colors } = useProfileTheme();
    const [activeTab, setActiveTab] = useState<TabId>("account");

    const iconProps = {
        className: "size-5 md:size-5.5 xl:size-6", style: { color: colors.primary }, "aria-hidden": true, focusable: false,
    };

    const icons = {
        account: <ShieldSecurity variant="Bold" {...iconProps} />,
        post: <Shop variant="Bold" {...iconProps} />,
        advert: <Shop variant="Bold" {...iconProps} />,
    };

    const label = activeTab === "account"
        ? isOwner ? "Account Status" : "Account Summary" : activeTab === "advert" ? "Market Place" : "Posts";


    return (
        <main className="mx-auto max-w-7xl">
            <section className="mt-10">
                <div className="flex gap-x-1 text-sm md:text-base xl:text-lg items montserrat">
                    <Gallery variant="Bold" className="size-5 md:size-5.5 xl:size-6" style={{ color: colors.primary }} />
                    <p className="font-medium">Media</p>
                    <p className="font-bold">{media.length}</p>
                </div>
                {media.length > 0 ?
                    <MediaGallery media={media} username={username} isOwner={isOwner} />
                    :
                    <div className="flex flex-col items-center gap-y-2 py-8">
                        <Cobweb color={colors.primary} />
                        <p style={{ color: colors.primary }} className="capitalize montserrat">{username}'s Cobweb-filled media shelf.</p>
                    </div>
                }
            </section>
            {isOwner &&
                <section className="mt-10">
                    <div className="flex gap-x-1 text-sm md:text-base xl:text-lg items montserrat">
                        <TagUser variant="Bold" className="size-5 md:size-5.5 xl:size-6" style={{ color: colors.primary }} />
                        <p className="font-medium">Invited Users</p>
                        <p className="font-bold"><span style={{ color: colors.primary }}>{invitedUser.length}</span>/{referralPrivilege}</p>
                    </div>
                    {invitedUser.length > 0 ? (
                        invitedUser.map((user) => (
                            <Link style={{ backgroundColor: colors.primary + 20 }} to="/profile" search={{ profile: user.username }} key={`invitedUser_${user._id}`} className="flex items-center gap-x-2 my-4 p-2 md:p-3 xl:p-4 border border-border rounded-2xl">
                                <Avatar>
                                    <AvatarImage src={user.profile?.profilePicture} />
                                    <AvatarFallback>{user.username.charAt(0).toUpperCase() || "??"}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p style={{ color: colors.primary }} className="font-medium text-base md:text-lg xl:text-xl">{user.username}</p>
                                    {user.isCore && <Badge className="bg-core/10 -mt-1 border-core text-core"><MedalStar variant="Bold" /> Core Member</Badge>}
                                    {user.isPremium && <Badge className="bg-premium/10 -mt-1 border-premium text-premium"><Crown1 variant="Bold" /> Premium Member</Badge>}
                                    {user.isModerator && <Badge className="bg-moderator/10 -mt-1 border-moderator text-moderator"><Star1 variant="Bold" /> Moderator</Badge>}
                                    {user.isSuspended &&
                                        <Badge variant="destructive" className='-mt-1'>
                                            <Slash /> Suspended
                                        </Badge>
                                    }
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="flex flex-col items-center gap-y-2 py-8">
                            <Cobweb color={colors.primary} />
                            <p style={{ color: colors.primary }}>No invited users yet.</p>
                        </div>
                    )}
                </section>
            }
            <section className="mt-10">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-x-1 text-sm md:text-base xl:text-lg items montserrat">
                        {icons[activeTab] || null}
                        <p className="font-medium">{label}</p>
                    </div>
                    <div className="flex items-center gap-0.5 bg-muted p-0.5 rounded-xl">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className={cn("relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium text-xs transition-all duration-200 cursor-pointer",
                                        activeTab === tab.id ? "" : "text-gray-400 dark:text-gray-600 hover:text-accent dark:hover:text-accent")}>
                                    {activeTab === tab.id && (
                                        <motion.div layoutId="feed-tab-indicator"
                                            className="absolute inset-0 bg-background shadow-sm border border-border/50 rounded-xl"
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                                    )}
                                    <Icon className={cn("z-10 relative size-3.5", activeTab === tab.id ? "text-primary" : "")} />
                                    <span className="hidden sm:inline z-10 relative">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
                {activeTab === "account" && (
                    <AccountStatus
                        isEmailVerified={isEmailVerified}
                        profileLock={profileLock}
                        chatLock={chatLock}
                        discoverable={discoverable}
                        flagged={flagged}
                        isSuspended={isSuspended}
                        referralPrivilege={referralPrivilege}
                        isOwner={isOwner}
                        dateOfBirth={dateOfBirth}
                        email={email}
                        createdAt={createdAt}
                    />
                )}
            </section>
        </main>
    );
}

export default Body;