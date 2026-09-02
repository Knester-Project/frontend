import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { sileo } from "sileo";

// Utils and Services
import { cn } from "@/lib/utils";
import { formatLastSeen } from "@/utils/format";
import { searchFn } from "@/services/api.services";

// UIs
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Icons
import { CloseSquare, Lock, SearchNormal, Slash, Verify } from "iconsax-reactjs";
import { Loader2 } from "lucide-react";

const New = ({ onClose }: { onClose: () => void }) => {

    const inputRef = useRef<HTMLInputElement | null>(null);

    const [query, setQuery] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [results, setResults] = useState<User[]>([]);

    useEffect(() => {
        const trimmedQuery = query.trim();

        // Don't search until there are at least 2 characters
        if (trimmedQuery.length < 2) {
            setResults([]);
            setLoading(false);
            return;
        }

        let cancelled = false;

        // Small debounce so we don't hit the API on every keystroke
        const timeout = setTimeout(async () => {
            try {
                setLoading(true);

                const result = await searchFn(trimmedQuery);
                const data: User[] = result?.data;
                if (!cancelled) setResults(Array.isArray(data) ? data : []);
            } catch {
                if (!cancelled) {
                    setResults([]);
                    sileo.error({ title: "Failed to find users try again later" })
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }, 300);

        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };
    }, [query]);

    return (
        <main>
            <header className={`pb-3`}>
                <div className="flex justify-between items-center mb-3">
                    <h2 className="font-display font-bold text-base md:text-lg xl:text-xl">
                        New message
                    </h2>

                    <button onClick={onClose} className="hover:bg-destructive/10 p-1.5 rounded-full text-muted-foreground hover:text-destructive duration-200 cursor-pointer" aria-label="Close">
                        <CloseSquare className="size-4 md:size-4.5 xl:size-5" />
                    </button>
                </div>

                <div className="relative">
                    <SearchNormal className="top-1/2 left-3.5 absolute size-3 md:size-3.5 xl:size-4 text-muted-foreground -translate-y-1/2" />

                    <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by username…"
                        className="py-3 pr-10 pl-10 border border-border focus:border-primary/20 rounded-md outline-none focus:ring-2 focus:ring-primary/20 w-full placeholder:text-muted-foreground transition-all smallText"
                        aria-label="Search username"
                    />

                    {query && (
                        <button onClick={() => setQuery("")} aria-label="Clear"
                            className="top-1/2 right-3 absolute hover:bg-destructive/10 text-muted-foreground hover:text-destructive -translate-y-1/2 cursor-pointer">
                            <CloseSquare className="size-4 md:size-4.5 xl:size-5" />
                        </button>
                    )}
                </div>
            </header>

            <section className="flex-1 mt-2 overflow-y-auto">
                {query.trim().length < 2 ? (
                    <EmptyHint text="Type at least 2 characters to find someone." />
                ) : loading ? (
                    <div className="flex justify-center items-center gap-2 py-10 text-muted-foreground">
                        <Loader2 className="size-4 md:size-4.5 xl:size-5 animate-spin" />
                        <span className="smallText">Searching…</span>
                    </div>
                ) : results.length === 0 ? (
                    <EmptyHint text={`No users found for "${query.trim()}".`} />
                ) : (
                    results.map((u, i) => (
                        <SearchResultRow key={u._id ?? i} user={u} />
                    ))
                )}
            </section>
        </main>
    );
};

export default New;

export function EmptyHint({ text }: { text: string }) {
    return (
        <p className="px-6 py-10 text-muted-foreground text-center montserrat smallText">
            {text}
        </p>
    );
}

function SearchResultRow({ user }: { user: User }) {
    const profile = user.profile;
    const locked = profile?.profileLock || profile?.chatLock;
    const blocked = user.isSuspended;
    const navigate = useNavigate();

    return (
        <motion.button initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} disabled={blocked}
            onClick={() =>
                !blocked &&
                navigate({
                    to: "/messages",
                    search: {
                        username: `${user.username}`,
                        isFeed: undefined,
                    },
                })
            }
            className={cn(
                "flex items-center gap-3 p-2 border border-primary/10 rounded-2xl w-full text-left transition-colors cursor-pointer",
                blocked ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/10"
            )}>
            <div className="relative flex-shrink-0">
                <Avatar className="size-10 md:size-11 xl:size-12">
                    <AvatarImage src={user.profile?.profilePicture} />
                    <AvatarFallback className="bg-primary/10 font-bold text-primary">
                        {user.username.slice(0, 2).toUpperCase() || "??"}
                    </AvatarFallback>
                </Avatar>

                {profile?.isOnline && !blocked && (
                    <span className="right-0 bottom-0 absolute bg-green-500 border-2 border-card rounded-full size-3" />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                    <p className="font-semibold tracking-wider">
                        {user.username}
                    </p>

                    {user.isPremium && (
                        <Verify variant="Bold" className="size-4 md:size-4.5 xl:size-5 text-premium" />
                    )}
                    {user.isCore && (
                        <Verify variant="Bold" className="size-4 md:size-4.5 xl:size-5 text-core" />
                    )}

                    {user.isModerator && (
                        <Verify variant="Bold" className="size-4 md:size-4.5 xl:size-5 text-moderator" />
                    )}
                </div>

                <p className="text-muted-foreground truncate smallText montserrat">
                    {blocked
                        ? "Account suspended"
                        : locked
                            ? "Profile locked"
                            : profile?.isOnline
                                ? "Active now"
                                : profile?.lastSeen
                                    ? `Last seen ${formatLastSeen(profile.lastSeen)}`
                                    : "Offline"}
                </p>
            </div>

            {blocked ? (
                <Slash className="flex-shrink-0 size-4 md:size-4.5 xl:size-5 text-destructive" />
            ) : locked ? (
                <Lock className="flex-shrink-0 size-4 md:size-4.5 xl:size-5 text-muted-foreground" />
            ) : null}
        </motion.button>
    );
}
