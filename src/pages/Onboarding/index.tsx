import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { sileo } from "sileo";

// Utils, Assets and Services
import { cn } from "@/lib/utils";
import { format } from "@/utils/format";
import { GENRES } from "@/assets/genres";
import { useSyncProfile } from "@/services/userMutations";
import { toGenres } from "@/utils/generate";

// UIs
import { Button } from "@/components/ui/button";

// Icons
import { Loader2 } from "lucide-react";
import { Like1, Profile2User, TickCircle, Lock, ArrowRight3 } from "iconsax-reactjs";



function GroupChip({ group, onLocked }: { group: GenreGroup, onLocked: (group: GenreGroup) => void }) {
    return (
        <button
            onClick={() => onLocked(group)}
            className="flex justify-between items-center gap-3 bg-card hover:bg-primary/10 px-4 py-3 border border-border hover:border-primary/40 rounded-2xl w-full text-left transition-all cursor-pointer"
        >
            <div className="flex items-center gap-3 min-w-0">
                <div className="flex flex-shrink-0 justify-center items-center bg-primary/10 rounded-xl size-8 md:size-9 xl:size-10">
                    <Lock className="size-4 md:size-4.5 xl:size-5 text-primary" />
                </div>
                <div className="min-w-0">
                    <p className="font-semibold text-[11px] text-foreground md:text-xs xl:text-sm truncate">{group.name}</p>
                    <div className="flex items-center gap-1 text-[10px] text-foreground/70 md:text-[11px] xl:text-xs">
                        <Profile2User className="size-3 md:size-3.5 xl:size-4" />
                        {format(group.members)} members
                        {group.isPrivate && <span className="ml-1 text-primary">· Private</span>}
                    </div>
                </div>
            </div>
            <ArrowRight3 className="flex-shrink-0 size-3 md:size-3.5 xl:size-4 text-foreground/70" />
        </button>
    );
}

export default function GenreOnboarding() {

    const navigate = useNavigate();
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

    const toggleGenre = (genreId: string) => {
        setSelectedGenres((prev) =>
            prev.includes(genreId)
                ? prev.filter((g) => g !== genreId)
                : [...prev, genreId]
        );
    };

    const selectedGenreObjects = GENRES.filter((g) => selectedGenres.includes(g.id));

    const handleGroupClick = (group: GenreGroup) => {
        sileo.info({
            title: "Groups aren't available yet",
            description: `"${group.name}" will be open once the feature launches. Stay tuned!`
        })
    };

    const syncProfile = useSyncProfile()
    const handleSave = async () => {
        if (selectedGenres.length === 0) return;

        const payload = toGenres(selectedGenres)

        syncProfile.mutate(payload, {
            onSuccess: () => {
                sileo.success({
                    title: "Genres updated! 🎉",
                    description: `You've selected ${selectedGenres.length} ${selectedGenres.length === 1 ? "genre" : "genres"}.`,
                });
                navigate({ to: "/feed" })
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (error: any) => {
                const message = error?.response?.data?.message || "Couldn't update preferred genres now, kindly try again later.";
                sileo.error({ title: "Error", description: message });
            },
        });
    };

    return (
        <div className="mx-auto w-full max-w-2xl min-h-dvh">
            <div className="px-4 py-8 md:py-10 xl:py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center"
                >
                    <div className="inline-flex justify-center items-center bg-primary/10 mb-4 rounded-2xl size-12 md:size-14 xl:size-16">
                        <Like1 className="size-6 md:size-7 xl:size-8 text-primary" />
                    </div>
                    <h1 className="font-bold text-lg sm:text-xl md:text-2xl xl:text-3xl">Pick your interests</h1>
                    <p className="mx-auto mt-2 max-w-sm text-[11px] text-foreground/70 md:text-xs xl:text-sm">
                        Select the genres you're passionate about. We'll tailor your feed and show you relevant groups.
                    </p>
                </motion.div>

                {/* Genre grid */}
                <div className="gap-3 grid grid-cols-2 sm:grid-cols-3 mb-8">
                    {GENRES.map((genre, idx) => {
                        const isSelected = selectedGenres.includes(genre.id);
                        return (
                            <motion.button
                                key={genre.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.04 }}
                                onClick={() => toggleGenre(genre.id)}
                                className={cn(
                                    "relative flex flex-col items-center gap-2 p-4 border-2 rounded-2xl overflow-hidden transition-all cursor-pointer",
                                    isSelected ? "shadow-sm" : "border-border bg-card hover:border-primary/10"
                                )}>

                                {/* Gradient glow when selected */}
                                {isSelected && (
                                    <div className={cn("absolute inset-0 bg-gradient-to-br opacity-10", genre.color)} />
                                )}

                                <span className={cn("z-2 relative size-6 md:size-6.5 xl:size-7")}><genre.icon variant="Bold"  /></span>
                                <span className="z-2 relative font-semibold text-[11px] text-muted-foreground md:text-xs xl:text-sm">{genre.name}</span>
                                {isSelected && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="top-2 right-2 z-3 absolute flex justify-center items-center bg-primary rounded-full w-5 h-5"
                                    >
                                        <TickCircle className="size-3 text-primary-foreground" strokeWidth={3} />
                                    </motion.div>
                                )}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Groups per selected genre */}
                <AnimatePresence mode="wait">
                    {selectedGenreObjects.length > 0 && (
                        <motion.div
                            key={selectedGenres.join(",")}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-5 mb-8"
                        >
                            <div className="flex items-center gap-2">
                                <Profile2User className="size-4 text-primary" />
                                <h2 className="font-semibold text-[11px] text-foreground/70 md:text-xs xl:text-sm uppercase tracking-wide">
                                    Groups in your genres
                                </h2>
                            </div>

                            {selectedGenreObjects.map((genre) => (
                                <div key={genre.id}>
                                    <div className="flex items-center gap-2 mb-2.5">
                                        <span className="size-6 md:size-6.5 xl:size-7 text-lg"><genre.icon /></span>
                                        <h3 className="font-bold text-[11px] text-foreground md:text-xs xl:text-sm">{genre.name}</h3>
                                        <span className="text-[10px] text-foreground/70 md:text-[11px] xl:text-xs">· {genre.groups.length} groups</span>
                                    </div>
                                    <div className="space-y-2">
                                        {genre.groups.map((group) => (
                                            <GroupChip key={group.id} group={group} onLocked={handleGroupClick} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Empty hint */}
                {selectedGenres.length === 0 && (
                    <div className="py-10 border-2 border-border border-dashed rounded-2xl text-center">
                        <Like1 className="mx-auto mb-2 size-6 md:size-7 xl:size-8 text-foreground/30" />
                        <p className="text-[11px] text-foreground/70 md:text-xs xl:text-sm">
                            Tap any genre above to preview related groups.
                        </p>
                    </div>
                )}

                {/* Save button */}
                <div className="bottom-0 sticky bg-background/80 backdrop-blur-sm -mx-4 px-4 pt-4 pb-2">
                    <Button
                        onClick={handleSave}
                        disabled={selectedGenres.length === 0 || syncProfile.isPending}
                        className="shadow-sm rounded-xl w-full h-12 font-semibold smallText"
                    >
                        {syncProfile.isPending ? (
                            <>
                                <Loader2 className="size-3 md:size-3.5 xl:size-4 animate-spin" /> Saving…
                            </>
                        ) : (
                            <>
                                Update Genres
                                {selectedGenres.length > 0 && (
                                    <span className="ml-1 text-primary-foreground/70">({selectedGenres.length})</span>
                                )}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}