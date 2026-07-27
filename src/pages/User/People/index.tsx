import React, { type ReactNode } from "react";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, type HTMLMotionProps } from "framer-motion";
import { Route } from "@/routes/_dashboard/people";
import { sileo } from "sileo";

// Utils, Stores, Services, Hooks and Constants
import { cn } from "@/lib/utils";
import { formatTrendingCount } from "@/utils/format";
import { meStore } from "@/stores/me.store";
import { usePeoplePage, useNearByPeople } from "@/services/userQueries";
import useInfiniteScroll from "@/Hooks/useInfiniteScroll";
import { NEARBY_LIMIT } from "@/assets/constants";

// UIs
import Main from "@/components/Main";
import DistanceSlider from "./DistanceSlider";
import { EmptyHint } from "./EmptyHint";
import StateSelector from "./StateSelector";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import UserChatLoader from "./ChatLoader";
import PremiumGate from "./PremiumGate";
import UserCard from "./UserCard";
import Gate from "./Gate";

// Icons
import { Profile2User, ShieldSecurity, Location, Shuffle, Discover } from "iconsax-reactjs";

const Index = () => {

    const { user } = meStore();
    const { mode } = Route.useSearch();

    // Hooks
    const navigate = Route.useNavigate();
    const { data } = usePeoplePage();
    const [distance, setDistance] = useState(25);
    const [nearbyActive, setNearbyActive] = useState<boolean>(false);
    const [selectedState, setSelectedState] = useState<string | null>(null);
    const [isPremiumOnly, setIsPremiumOnly] = useState<boolean>(false);
    const [isOnlineOnly, setIsOnlineOnly] = useState<boolean>(false);


    // Functions
    const setMode = (newMode: string) => {
        const isRestricted =
            newMode === "state" &&
            !(user?.isPremium || user?.isCore || user?.isModerator);

        if (isRestricted) {
            return sileo.error({
                title: "Unavailable",
                description: "This option is available to premium users only",
            });
        }

        navigate({
            search: (prev) => ({
                ...prev,
                mode: newMode,
            }),
        });
    };

    const toggleOnline = () => {
        const isRestricted = !(user?.isPremium || user?.isCore || user?.isModerator);
        if (isRestricted) {
            return sileo.error({
                title: "Unavailable",
                description: "This option is available to premium users only",
            });
        }

        setIsOnlineOnly((prev) => !prev)
    }

    const togglePremium = () => {
        const isRestricted = !(user?.isPremium || user?.isCore || user?.isModerator);
        if (isRestricted) {
            return sileo.error({
                title: "Unavailable",
                description: "This option is available to premium users only",
            });
        }

        setIsPremiumOnly((prev) => !prev)
    }

    const handleState = (newState: string) => {
        setNearbyActive(false);
        setSelectedState(newState);
    }

    const queries = useMemo(() => ({
        radiusKm: distance,
        state: selectedState || "",
        limit: NEARBY_LIMIT,
        premiumOnly: isPremiumOnly,
        onlineOnly: isOnlineOnly
    }), [distance, isOnlineOnly, isPremiumOnly, selectedState]);

    const {
        data: nearbyUsers,
        fetchNextPage,
        isLoading,
        hasNextPage,
        isFetchingNextPage,
    } = useNearByPeople(queries);

    const loadMoreRef = useInfiniteScroll({
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    });

    const users = nearbyUsers?.pages.flatMap((page) => page.data.profiles) ?? [];

    if (!user?.profile?.discoverable) {
        return <Gate />
    }

    return (
        <Main classNames="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
                {mode === "entry" && (
                    <motion.div key="entry" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.28 }} className="space-y-5">
                        {/* Header */}
                        <section className="bg-accent/20 dark:bg-accent/5 shadow-sm p-4 md:p-6 xl:p-8 border border-border rounded-3xl">
                            <div>
                                <div className="flex justify-center items-center bg-primary backdrop-blur-sm mb-5 rounded-2xl size-10 md:size-12 xl:size-14">
                                    <Profile2User className="size-5 md:size-6 xl:size-7" variant="Bold" />
                                </div>
                                <h2 className="mb-2 font-bold text-lg md:text-xl xl:text-2xl">Meet New People</h2>
                                <p className="max-w-xs text-[11px] md:text-xs xl:text-sm leading-relaxed">
                                    Connect with real people by location, city, state, or how close they are to you.
                                </p>
                            </div>
                        </section>
                        {/* Action Card */}
                        <section className="gap-5 grid grid-cols-2">
                            <ActionCard icon={<Location className="size-4 md:size-5 xl:size-6" />}
                                title="Find by State" desc="Browse people in any of the 36 Nigerian states"
                                color="bg-accent/60 text-accent-foreground/80" iconBg="bg-primary/20 text-primary-foreground"
                                onClick={() => setMode("state")}
                            />
                            <ActionCard icon={<Shuffle className="size-4 md:size-5 xl:size-6" />} title="Random Match"
                                desc="Set a radius and discover people close to you" color="bg-amber-50 dark:bg-amber-950/30 text-foreground/80"
                                iconBg="bg-amber-500/10 text-amber-600"
                                onClick={() => setMode("random")}
                            />
                        </section>
                        {/* Stats Report */}
                        <section className="gap-3 grid grid-cols-3">
                            {[
                                { label: "Active users", value: formatTrendingCount(data?.data?.totalOnlineUser ?? 0) || "...k" },
                                { label: "States covered", value: "36" },
                                { label: "Chats started", value: formatTrendingCount(data?.data?.totalChats ?? 0) || "...k" },
                            ].map((s) => (
                                <div key={s.label} className="bg-card shadow-sm px-4 py-3 border border-border rounded-2xl text-card-foreground text-center">
                                    <p className="font-bold lining-nums text-base md:text-lg xl:text-xl">{s.value}</p>
                                    <p className="mt-0.5 text-[10px] text-gray-600 md:text-[11px] dark:text-gray-400 xl:text-xs">{s.label}</p>
                                </div>
                            ))}
                        </section>
                        {/* Community Notice */}
                        <section className={cn("flex items-start gap-3 bg-accent/20 dark:bg-accent/10 shadow-sm p-4 border border-accent/40 dark:border-accent/20 rounded-2xl")}>
                            <ShieldSecurity className="mt-0.5 size-5 md:size-[22px] xl:size-6 text-primary shrink-0" />
                            <div className="flex-1">
                                <h4 className="mb-1 font-semibold text-foreground text-sm md:text-base xl:text-lg">
                                    Community Safety Notice
                                </h4>
                                <p className="text-[11px] text-foreground/80 md:text-xs xl:text-sm leading-relaxed">
                                    You are solely responsible for your interactions with others on this platform.
                                    Please exercise caution, independently verify the identity of anyone you choose
                                    to communicate, transact, or meet with. While we work hard to maintain a secure
                                    environment, absolute safety cannot be guaranteed. Protect your personal information.
                                </p>
                            </div>
                        </section>
                    </motion.div>
                )}
                {mode === "random" && (
                    <motion.div key="random" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.28 }} className="space-y-4">
                        <header className="montserrat">
                            <h2 className="font-bold text-lg md:text-xl xl:text-2xl">People</h2>
                            <p className="max-w-xs text-[11px] md:text-xs xl:text-sm leading-relaxed">
                                Within <span className="font-semibold text-primary">{distance} KM</span> of you.
                            </p>
                        </header>
                        <section className="bg-accent/10 p-4 border border-border rounded-3xl">
                            <DistanceSlider value={distance} onChange={setDistance} />
                        </section>
                        <section className="space-y-4">

                            {/* Premium Filter */}
                            <div className="flex justify-between items-start bg-accent/10 p-4 border border-border rounded-3xl">
                                <div className="space-y-1">
                                    <Label className="font-semibold text-[11px] md:text-xs xl:text-sm">
                                        Premium users only
                                    </Label>
                                    <p className="text-[10px] text-foreground/80 md:text-[11px] xl:text-xs">
                                        Show only users with premium access and exclusive features
                                    </p>
                                </div>

                                <Switch checked={isPremiumOnly} onCheckedChange={togglePremium} />
                            </div>

                            {/* Online Filter */}
                            <div className="flex justify-between items-start bg-accent/10 p-4 border border-border rounded-3xl">
                                <div className="space-y-1">
                                    <Label className="font-semibold text-[11px] md:text-xs xl:text-sm">
                                        Online users only
                                    </Label>
                                    <p className="text-[10px] text-foreground/80 md:text-[11px] xl:text-xs">
                                        Display only users who are currently active
                                    </p>
                                </div>

                                <Switch checked={isOnlineOnly} onCheckedChange={toggleOnline} />
                            </div>

                        </section>
                    </motion.div>
                )}
                {mode === "state" ? (
                    user?.isPremium || user?.isCore || user?.isModerator ? (
                        <motion.div key="state" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.28 }} className="space-y-4">
                            {/* Controls */}
                            <section className="space-y-3 bg-accent/10 p-4 border border-border rounded-2xl">
                                <StateSelector selected={selectedState} setSelected={handleState} />

                                {/* Nearby toggle */}
                                <button onClick={() => { setNearbyActive((v) => !v); setSelectedState(null); setDistance(15) }} className={cn("flex items-center gap-2.5 px-4 py-3 border rounded-2xl w-full font-medium text-[11px] md:text-xs xl:text-sm transition-all duration-300 cursor-pointer",
                                    nearbyActive ? "border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                                        : "border-border bg-background text-gray-600 dark:text-gray-400 hover:border-green-400/40 hover:text-foreground dark:hover:text-foreground")}>
                                    <Discover className={cn("size-4", nearbyActive && "text-green-500")} />
                                    <span className="montserrat">{nearbyActive ? "Showing Nearby (within 15 km)" : "Use my location — Nearby"}</span>
                                    {nearbyActive && <span className="bg-green-500/15 ml-auto px-2 py-0.5 rounded-lg font-semibold text-[10px] text-green-600 md:text-[11px] xl:text-xs">Active</span>}
                                </button>
                            </section>
                            <section className="space-y-4">

                                {/* Premium Filter */}
                                <div className="flex justify-between items-start bg-accent/10 p-4 border border-border rounded-xl">
                                    <div className="space-y-1">
                                        <Label className="font-semibold text-[11px] md:text-xs xl:text-sm">
                                            Premium users only
                                        </Label>
                                        <p className="text-[10px] text-foreground/80 md:text-[11px] xl:text-xs">
                                            Show only users with premium access and exclusive features
                                        </p>
                                    </div>

                                    <Switch checked={isPremiumOnly} onCheckedChange={togglePremium} />
                                </div>

                                {/* Online Filter */}
                                <div className="flex justify-between items-start bg-accent/10 p-4 border border-border rounded-xl">
                                    <div className="space-y-1">
                                        <Label className="font-semibold text-[11px] md:text-xs xl:text-sm">
                                            Online users only
                                        </Label>
                                        <p className="text-[10px] text-foreground/80 md:text-[11px] xl:text-xs">
                                            Display only users who are currently active
                                        </p>
                                    </div>

                                    <Switch checked={isOnlineOnly} onCheckedChange={toggleOnline} />
                                </div>

                            </section>
                        </motion.div>
                    )
                        : (
                            <PremiumGate />
                        )
                ) : null}
                {/* Results */}
                {(mode === "state" || mode === "random") && <React.Fragment key="random-mode">
                    {isLoading && (
                        <div className="gap-4 grid grid-cols-2 md:grid-cols-4 py-4">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <UserChatLoader key={`first_loader_${index}`} />
                            ))}
                        </div>
                    )}

                    {/* Show the actual UserCards when data is ready */}
                    {!isLoading && users.length === 0 && (
                        <EmptyHint text="No more nearby users to show — please adjust your filters if you desire to see more." />
                    )}

                    {!isLoading && users.length > 0 && (
                        <>
                            <h1 className="mt-8 font-semibold lining-nums">Found {users.length} {users.length > 1 ? "Accounts" : "Account"}</h1>
                            <div className="gap-4 grid grid-cols-2 md:grid-cols-4 py-4">
                                {users.map((user, index) => (
                                    <UserCard key={`chat_user_card_${user._id || index}`} user={user} index={index} />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Loading next page */}
                    {isFetchingNextPage && (
                        <div className="gap-4 grid grid-cols-2 md:grid-cols-4 py-4">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <UserChatLoader key={`chat_loader_${index}`} />
                            ))}
                        </div>
                    )}

                    {/* No more data */}
                    {!hasNextPage && users.length > 0 && (
                        <EmptyHint text="No more nearby users to show — please adjust your filters if you desire to see more." />
                    )}

                    {/* Intersection trigger */}
                    <div ref={loadMoreRef} className="w-full h-4" />
                </React.Fragment>
                }
            </AnimatePresence>
        </Main >
    );
}

export default Index;

export interface ActionCardProps extends HTMLMotionProps<"button"> {
    icon: ReactNode;
    title: string;
    desc: string;
    color?: string;
    iconBg?: string;
}

const ActionCard = ({ icon, title, desc, color, iconBg, onClick, className, ...props }: ActionCardProps) => {
    return (
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClick}
            className={cn("flex flex-col items-start gap-3 hover:shadow-md p-4 border border-border/40 rounded-3xl text-left transition-all cursor-pointer", color, className)} {...props}>
            <div className={cn("flex justify-center items-center rounded-xl size-11 shrink-0", iconBg)}>
                {icon}
            </div>
            <div>
                <p className="font-bold text-[11px] md:text-xs xl:text-sm">{title}</p>
                <p className="mt-0.5 font-medium lining-nums text-[10px] md:text-[11px] xl:text-xs leading-relaxed">{desc}</p>
            </div>
        </motion.button>
    );
}