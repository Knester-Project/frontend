import { useState } from "react";
import { motion } from "framer-motion";

// Stores, Utils and Services
import { useProfileTheme } from "@/stores/profileTheme.store";
import { cn } from "@/lib/utils";
import { useUserAdverts } from "@/services/userQueries";

// UIs
import MediaGallery from "./MediaGallery";
import AccountStatus from "./AccountStatus";
import Cobweb from "@/components/Cobweb";
import AdvertLoader from "@/components/AdvertLoader";
import AdvertError from "@/components/AdvertError";
import Adverts from "./Adverts";
import Posts from "./Posts";

// Icons
import { TagUser, ShieldSecurity, Gallery, Shop, ReceiptText } from "iconsax-reactjs";


const TABS = [
    { id: "account", label: "Account", icon: TagUser },
    { id: "post", label: "Posts", icon: ReceiptText },
    { id: "advert", label: "Adverts", icon: Shop },
] as const;

type TabId = (typeof TABS)[number]["id"];

const Body = ({ user }: { user: UserDetails }) => {

    const { username, isEmailVerified, discoverable, isSuspended, email, createdAt } = user;
    const { media = [], profileLock = false, chatLock = false, flagged = false, dateOfBirth = "" } = user.profile ?? {};

    const { colors } = useProfileTheme();
    const [activeTab, setActiveTab] = useState<TabId>("account");

    const iconProps = {
        className: "size-5 md:size-5.5 xl:size-6", style: { color: colors.primary }, "aria-hidden": true, focusable: false,
    };

    const icons = {
        account: <ShieldSecurity variant="Bold" {...iconProps} />,
        post: <ReceiptText variant="Bold" {...iconProps} />,
        advert: <Shop variant="Bold" {...iconProps} />,
    };

    const label = activeTab === "account" ? "Account Summary" : activeTab === "advert" ? "Market Place" : "Posts";

    const { data: advertData, isLoading: advertLoading, isError: advertError, refetch: refetchAdvert } = useUserAdverts(username);
    const adverts = advertData?.data || [];


    return (
        <main className="mx-auto max-w-7xl">
            <section className="mt-10">
                <div className="flex gap-x-1 text-sm md:text-base xl:text-lg items montserrat">
                    <Gallery variant="Bold" className="size-5 md:size-5.5 xl:size-6" style={{ color: colors.primary }} />
                    <p className="font-medium">Media</p>
                    <p className="font-bold">{media.length}</p>
                </div>
                {media.length > 0 ?
                    <MediaGallery media={media} username={username} isOwner={false} />
                    :
                    <div className="flex flex-col items-center gap-y-2 py-8">
                        <Cobweb color={colors.primary} />
                        <p style={{ color: colors.primary }} className="capitalize montserrat">{username}'s Cobweb-filled media shelf.</p>
                    </div>
                }
            </section>
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
                        referralPrivilege={0}
                        isOwner={false}
                        dateOfBirth={dateOfBirth}
                        email={email}
                        createdAt={createdAt}
                    />
                )}
                {activeTab === "advert" && (
                    <>
                        {advertLoading && (
                            <main className="gap-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <AdvertLoader key={`advertLoading_${i}`} />
                                ))}
                            </main>
                        )}

                        {advertError && (
                            <AdvertError refetch={refetchAdvert} />
                        )}

                        {!advertError && !advertLoading && (
                            <Adverts adverts={adverts} isOwner={false} />
                        )}
                    </>
                )}
                {activeTab === "post" && (
                    <Posts isOwner={false} />
                )}
            </section>
        </main>
    );
}

export default Body;