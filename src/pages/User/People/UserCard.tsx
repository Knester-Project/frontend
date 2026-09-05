import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

// Libs
import { cn } from "@/lib/utils";

// UIs
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Icons
import { Lock, MapPin } from "lucide-react";
import { MessageText1, Verify } from "iconsax-reactjs";

// Types
export type GeoPoint = {
    type: 'Point';
    coordinates: [number, number];
};

export type UserMeta = {
    isCore: boolean;
    isPremium: boolean;
    isSuspended: boolean;
    isModerator: boolean;
    username: string;
    _id: string;
};

export declare type NearbyProfile = {
    _id: string;
    bio: string;
    distance: number | null;
    distanceKm: number | null;
    isOnline: boolean;
    location: GeoPoint;
    profileLock: boolean;
    profilePicture: string;
    user: UserMeta;
};

// Define props for the Badge sub-component
interface BadgeProps {
    children: ReactNode;
    className?: string;
}

function Badge({ children, className }: BadgeProps) {
    return (
        <span className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[9px] uppercase tracking-wider",
            className
        )}>
            {children}
        </span>
    );
}

// Define Props for the main component
export interface UserCardProps {
    user: NearbyProfile;
    index?: number;
}

export default function UserCard({ user, index = 0 }: UserCardProps) {
    const isLocked = user.profileLock;
    const avatar = user.profilePicture;

    // Safe fallback just in case username is ever undefined from the backend
    const initials = (user.user.username || "??").slice(0, 2).toUpperCase();

    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04, duration: 0.3, ease: "easeOut" }}
            className="group relative flex flex-col justify-between bg-accent/10 hover:shadow-black/5 hover:shadow-xl border border-border/60 hover:border-primary/30 rounded-3xl overflow-hidden transition-all hover:-translate-y-1 duration-300 cursor-pointer">

            {user.user.isSuspended && (
                <div className="z-5 absolute inset-0 flex justify-center items-center bg-background/60 backdrop-blur-md rounded-2xl">
                    <span className="bg-background/80 shadow-sm px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-widest">
                        Suspended
                    </span>
                </div>
            )}

            {/* Avatar & User Info area */}
            <div className="relative flex flex-col items-center gap-y-2 p-4 pb-4">
                <div className="relative">
                    <Avatar className={cn(
                        "ring-border rounded-2xl ring-2 size-14 md:size-16 xl:size-20 overflow-hidden group-hover:scale-105 transition-all duration-300",
                        user.user.isPremium && "ring-primary/40 ring-offset-2 ring-offset-background"
                    )}>
                        {/* Load the image but apply a blur and dim it if locked */}
                        <AvatarImage src={avatar} className={cn(
                            "w-full h-full object-cover transition-all duration-300",
                            isLocked && "blur-sm scale-110 brightness-75"
                        )} />

                        {/*  Shows initials if there is no image at all */}
                        <AvatarFallback className={cn(
                            "flex justify-center items-center rounded-2xl w-full h-full font-bold text-sm md:text-base",
                            user.user.isPremium ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        )}>
                            {initials}
                        </AvatarFallback>

                        {/* The Lock Overlay: Absolutely positioned over the blurred image */}
                        {isLocked && (
                            <div className="z-5 absolute inset-0 flex justify-center items-center bg-background/20">
                                <Lock className="drop-shadow-lg size-4 md:size-5 xl:size-6 text-foreground/90" />
                            </div>
                        )}
                    </Avatar>

                    {/* Online Marker */}
                    {user.isOnline && (
                        <div
                            className="-right-1 -bottom-1 z-6 absolute bg-yellow-500 rounded-full ring-4 ring-card size-3 md:size-3.5 xl:size-4"
                            aria-label={`${user.user.username} was recently online`}
                            title={`${user.user.username} was recently online`}
                        />
                    )}
                </div>

                {/* Username and Bio */}
                <div className="text-center truncate">
                    <p className="font-bold text-xs md:text-sm xl:text-base tracking-tight">
                        {user.user.username}
                    </p>
                    <p className="text-[10px] md:text-[11px] xl:text-xs">{user.bio}</p>
                </div>


                {/* Badges - Increased gap slightly for better readability */}
                <div className="flex flex-wrap justify-center gap-1.5">
                    {user.user.isPremium && (
                        <Badge className="bg-premium/10 text-premium">
                            <Verify variant="Bold" className="size-3" /> Premium
                        </Badge>
                    )}
                    {user.user.isCore && (
                        <Badge className="bg-core/10 text-core">
                            <Verify variant="Bold" className="size-3" /> Core
                        </Badge>
                    )}
                    {user.user.isModerator && (
                        <Badge className="bg-moderator/10 text-moderator">
                            <Verify variant="Bold" className="size-3" /> Mod
                        </Badge>
                    )}
                    {isLocked && (
                        <Badge className="bg-muted/50 text-muted-foreground">
                            <Lock className="size-2.5" /> Private
                        </Badge>
                    )}
                </div>

                {/* Unified Distance display */}
                {user.distanceKm != null && (
                    <div className="flex justify-center items-center gap-1.5 font-medium text-[10px] text-foreground/70 md:text-[11px] xl:text-xs">
                        <MapPin className="size-3.5" />
                        <span className="font-semibold montserrat">
                            {user.distanceKm < 1
                                ? `${Math.round(user.distanceKm * 1000)} M apart`
                                : `${user.distanceKm.toFixed(1)} KM apart`}
                        </span>
                    </div>
                )}
            </div>

            {/* Chat CTA - Transformed into a proper flex button layout */}
            <Link to="/messages" search={{ username: user.user.username, isFeed: "true" }}
                className="flex justify-center items-center gap-2 bg-primary/10 hover:bg-primary w-full h-9 font-semibold text-[11px] text-primary hover:text-primary-foreground md:text-xs xl:text-sm transition-colors duration-300">
                <MessageText1 className="size-4" />
                <span>Start Chat</span>
            </Link>
        </motion.div>
    );
}