import { Link } from "@tanstack/react-router";

// Hooks
import { useNearByPeople } from "@/services/userQueries";

// UI
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Utils
import { cn } from "@/lib/utils";

// Icons
import { GlobalEdit, MessageText1 } from "iconsax-reactjs";
import { Lock } from "lucide-react";

const PeopleAround = () => {

    const { data, isLoading, isError, refetch } = useNearByPeople({
        radiusKm: 25,
        limit: 5,
    });

    const users =
        data?.pages.flatMap((page) => page.data.profiles) ?? [];

    return (
        <Card className="space-y-4 p-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <GlobalEdit className="size-6 text-primary" />
                    <p className="font-semibold">People Around</p>
                </div>

                <Link to="/people" search={{ mode: "random" }} className="hover:font-semibold text-primary text-xs hover:underline">
                    See more
                </Link>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <Skeleton className="rounded-2xl size-14" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="w-24 h-3" />
                                <Skeleton className="w-32 h-2" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Error */}
            {isError && (
                <div className="text-foreground/80 text-xs text-center">
                    Failed to load nearby users.
                    <button onClick={() => refetch()} className="ml-1 text-primary hover:underline">
                        Retry
                    </button>
                </div>
            )}

            {/* Empty */}
            {!isLoading && !isError && users.length === 0 && (
                <p className="py-4 text-foreground/80 text-xs text-center">
                    No people nearby right now
                </p>
            )}

            {/* Data */}
            {!isLoading && !isError && users.length > 0 && (
                <div className="space-y-3">
                    {users.map((user) => {
                        const isLocked = user.profileLock;
                        const avatar = user.profilePicture;

                        const initials = user.user.username?.slice(0, 2).toUpperCase();

                        return (
                            <div key={user._id} className="flex justify-between items-center gap-3">
                                {/* Left */}
                                <div className="flex flex-1 items-center gap-3 min-w-0">
                                    <Link to="/profile" search={{ profile: user.user.username }} className="shrink-0">
                                        {/* Avatar */}
                                        <div className="relative">
                                            <Avatar className={cn(
                                                "ring-border rounded-2xl ring-2 size-14 overflow-hidden transition-all duration-300",
                                                user.user.isPremium && "ring-primary/40 ring-offset-2 ring-offset-background")}>
                                                <AvatarImage src={avatar} className={cn("w-full h-full object-cover transition-all duration-300",
                                                    isLocked && "blur-sm scale-110 brightness-75")} />

                                                <AvatarFallback className={cn("flex justify-center items-center rounded-2xl w-full h-full font-bold text-sm",
                                                    user.user.isPremium ? "bg-primary/10 text-primary" : "bg-muted text-foreground/80")}>
                                                    {initials}
                                                </AvatarFallback>

                                                {/* Lock overlay */}
                                                {isLocked && (
                                                    <div className="absolute inset-0 flex justify-center items-center bg-background/20">
                                                        <Lock className="size-4 text-foreground/90" />
                                                    </div>
                                                )}
                                            </Avatar>

                                            {/* Online indicator */}
                                            {user.isOnline && (
                                                <div className="-right-1 -bottom-1 absolute bg-green-500 rounded-full ring-4 ring-card size-3" />
                                            )}
                                        </div>
                                    </Link>

                                    {/* Info */}
                                    <div className="flex flex-col min-w-0">
                                        <p className="font-bold text-xs xl:text-sm truncate">
                                            {user.user.username}
                                        </p>

                                        <p className="text-[11px] text-gray-600 dark:text-gray-400 xl:text-xs line-clamp-2 leading-snug">
                                            {user.bio || "No bio available"}
                                        </p>

                                        {user.distanceKm !== null && (
                                            <span className="mt-0.5 text-[10px] text-foreground/80">
                                                {user.distanceKm.toFixed(1)} km away
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="shrink-0">
                                    <Link to="/messages" search={{ username: user.user.username }}>
                                        <Button size="sm" className="bg-primary hover:bg-transparent border border-transparent hover:border-primary hover:text-primary transition-all duration-300">
                                            <MessageText1 className="size-3.5" variant="Bold" />
                                            <span className="ml-1 text-xs">Chat</span>
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </Card>
    );
};

export default PeopleAround;