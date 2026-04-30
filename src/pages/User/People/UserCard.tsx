import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

// Libs
import { cn } from "@/lib/utils";

// UIs
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Icons
import { Lock, MapPin, MessageCircle } from "lucide-react";
import { Verify } from "iconsax-reactjs";


// 2. Define props for the Badge sub-component
interface BadgeProps {
    children: ReactNode;
    className?: string;
}

function Badge({ children, className }: BadgeProps) {
    return (
        <span className={cn("inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md font-bold text-[9px] uppercase tracking-wider", className)}>
            {children}
        </span>
    );
}

// Define Props
export interface UserCardProps {
    user: PeopleUser;
    index?: number;
}

export default function UserCard({ user, index = 0 }: UserCardProps) {

    const isLocked = user.profile?.profileLock;
    const avatar = user.profile?.profilePicture;

    // Safe fallback just in case username is ever undefined from the backend
    const initials = (user.username || "??").slice(0, 2).toUpperCase();

    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04, duration: 0.3 }}
            className="group relative bg-card hover:shadow-black/5 hover:shadow-lg border border-border/60 hover:border-primary/20 rounded-2xl overflow-hidden transition-all duration-300">
            {/* Suspended overlay */}
            {user.isSuspended && (
                <div className="z-10 absolute inset-0 flex justify-center items-center bg-background/80 backdrop-blur-sm rounded-2xl">
                    <span className="font-semibold text-muted-foreground text-xs">Account suspended</span>
                </div>
            )}

            {/* Avatar area */}
            <div className="relative flex flex-col items-center p-4 pb-3">
                <div className="relative">
                    <Avatar className={cn("ring-border rounded-2xl ring-2 size-12 md:size-14 xl:size-16", user.isPremium && "ring-isPremium/30")}>
                        <AvatarImage src={isLocked ? undefined : avatar} className="object-cover" />
                        <AvatarFallback className={cn("rounded-2xl font-bold text-sm", user.isPremium ? "bg-premium/10 text-premium" : "bg-muted text-muted-foreground")}>
                            {isLocked ? <Lock className="size-5 text-muted-foreground" /> : initials}
                        </AvatarFallback>
                    </Avatar>
                    {/* Online dot */}
                    <div className="-right-0.5 -bottom-0.5 absolute bg-green-400 rounded-full ring-2 ring-card size-2.5 md:size-3 xl:size-3.5" />
                </div>

                {/* Username */}
                <p className="mt-2.5 px-1 max-w-full font-semibold text-[11px] text-foreground md:text-xs xl:text-sm truncate">
                    {user.username}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap justify-center gap-1 mt-1.5">
                    {user.isPremium && (
                        <Badge className="bg-premium/10 text-premium">
                            <Verify className="size-2.5" /> Premium
                        </Badge>
                    )}
                    {user.isCore && (
                        <Badge className="bg-core/10 text-core">
                            <Verify className="size-2.5" /> Core
                        </Badge>
                    )}
                    {user.isModerator && (
                        <Badge className="bg-moderator/10 text-moderator">
                            <Verify className="size-2.5" /> Mod
                        </Badge>
                    )}
                    {isLocked && (
                        <Badge className="bg-muted text-muted-foreground">
                            <Lock className="size-2.5" /> Private
                        </Badge>
                    )}
                </div>

                {/* Distance / State */}
                {/* <div className="flex items-center gap-1 mt-2 text-[11px] text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{user.state || "Unknown Location"}</span>
                    {user.distance != null && (
                        <>
                            <span className="text-border">·</span>
                            <span>{user.distance < 1 ? `${Math.round(user.distance * 1000)}m` : `${user.distance.toFixed(1)} km`}</span>
                        </>
                    )}
                </div> */}
            </div>

            {/* Chat CTA */}
            <div className="px-4 pb-4">
                <Link to="/messages" search={{ username: user.username }} className="gap-1.5 shadow-primary/20 shadow-sm rounded-xl w-full h-8 font-semibold text-[11px] md:text-xs xl:text-sm">
                    <MessageCircle className="size-3.5" />
                    Start Chat
                </Link>
            </div>
        </motion.div>
    );
}