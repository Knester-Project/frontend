import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Services, Stores and Utils
import { useUserAdverts } from "@/services/userQueries";
import { meStore } from "@/stores/me.store";
import { cn } from "@/lib/utils";

// UIs
import { Card } from "@/components/ui/card";
import AdvertLoader from "@/components/AdvertLoader";
import AdvertCard from "@/pages/User/Feed/AdvertCard";
import { Overlay } from '@/components/Overlay';
import AdvertForm from "./AdvertForm";

// Icons
import { Shop } from "iconsax-reactjs";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// Safely cast the environment variable to a number, with a fallback just in case
const MAX = Number(import.meta.env.VITE_ADVERT_LENGTH) || 5;

const Advert = () => {

    const { user } = meStore();
    const { data, isLoading, isError, refetch } = useUserAdverts();

    // States
    const [newAdvert, setNewAdvert] = useState<boolean>(false);
    const [activeIdx, setActiveIdx] = useState<number>(0);
    const [direction, setDirection] = useState<number>(1);        // 1=forward, -1=back

    // Constants
    const adverts: MyAdvert[] = data?.data || [];
    const canCreate = adverts.length < MAX;
    const isPremium = user?.isPremium || user?.isModerator || user?.isCore || false;

    const stackedAdverts = [
        adverts[activeIdx],
        adverts[(activeIdx + 1) % adverts.length],
        adverts[(activeIdx + 2) % adverts.length],
    ].filter(Boolean).slice(0, 3);

    // Functions
    const toggleNew = () => {
        setNewAdvert((prev) => !prev);
    }

    // Custom function to handle local carousel navigation
    const handleNavigate = (newDirection: number) => {
        setDirection(newDirection);
        setActiveIdx((i) => Math.min(Math.max(i + newDirection, 0), adverts.length - 1));
    };

    return (
        <Card className="p-4">
            <header className="flex items-center gap-2 mb-2">
                <Shop className="size-5 text-primary animate-pulse" />
                <p className="font-semibold text-base">Your Adverts</p>
            </header>

            {/* Loading State */}
            {isLoading && (
                <AdvertLoader />
            )}

            {/* Error State */}
            {isError && (
                <div className="flex items-center gap-3 bg-accent/10 shadow-lg mx-auto px-5 py-2.5 border border-accent/20 rounded-xl w-full">
                    <X className="size-6 text-destructive shrink-0" />
                    <span className="flex-1 font-medium text-xs">
                        Something went wrong, click retry
                    </span>
                    <button onClick={() => refetch()} className="bg-primary hover:bg-primary/90 px-3 py-1 rounded-xl font-semibold text-primary-foreground text-xs transition-colors cursor-pointer">
                        RETRY
                    </button>
                </div>
            )}

            {(!isError && !isLoading && isPremium && adverts.length < MAX) && (
                <button onClick={toggleNew} className="bg-primary hover:bg-primary/90 ml-auto px-3 py-1 rounded-xl w-fit font-semibold text-primary-foreground text-xs transition-colors cursor-pointer">
                    New Advert
                </button>
            )}

            {/* Data State */}
            {(!isLoading && !isError && adverts.length > 0) && (
                <div className="relative" style={{ height: 370 }}>
                    {/* Ghost cards (stack depth visual) */}
                    {stackedAdverts.slice(1).reverse().map((advert, idx) => {
                        const depth = stackedAdverts.length - 1 - idx;
                        return (
                            <div key={advert._id + "ghost" + depth} className="absolute inset-0 bg-accent/10 border border-border rounded-3xl"
                                style={{ transform: `scale(${1 - depth * 0.04}) translateY(${depth * -10}px)`, zIndex: 10 - depth }}
                            />
                        );
                    })}

                    {/* Active card */}
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div key={adverts[activeIdx]._id} custom={direction}
                            variants={{
                                enter: (d) => ({ x: d > 0 ? 60 : -60, opacity: 0, scale: 0.96 }),
                                center: { x: 0, opacity: 1, scale: 1 },
                                exit: (d) => ({ x: d > 0 ? -60 : 60, opacity: 0, scale: 0.96 }),
                            }} initial="enter" animate="center" exit="exit"
                            transition={{ type: "spring", stiffness: 370, damping: 28 }}
                            className="absolute inset-0" style={{ zIndex: 20 }}>
                            <AdvertCard advert={adverts[activeIdx]} isTop isOwner={true} />
                        </motion.div>
                    </AnimatePresence>

                    {/* Nav arrows */}
                    {adverts.length > 1 && (
                        <>
                            {/* Left Arrow: calls handleNavigate with -1 */}
                            <button onClick={() => handleNavigate(-1)} disabled={activeIdx === 0}
                                className={cn(
                                    "top-1/2 left-2 z-30 absolute flex justify-center items-center bg-card shadow-md border border-border rounded-full size-8 text-foreground/80 hover:text-foreground hover:scale-110 transition-all -translate-y-1/2 cursor-pointer",
                                    activeIdx === 0 && "opacity-30 pointer-events-none"
                                )}>
                                <ChevronLeft className="size-4" />
                            </button>

                            {/* Right Arrow: calls handleNavigate with 1 */}
                            <button onClick={() => handleNavigate(1)} disabled={activeIdx === adverts.length - 1}
                                className={cn(
                                    "top-1/2 right-2 z-30 absolute flex justify-center items-center bg-card shadow-md border border-border rounded-full size-8 text-foreground/80 hover:text-foreground hover:scale-110 transition-all -translate-y-1/2 cursor-pointer",
                                    activeIdx === adverts.length - 1 && "opacity-30 pointer-events-none"
                                )}>
                                <ChevronRight className="size-4" />
                            </button>
                        </>
                    )}
                </div>
            )}
            {!isLoading && !isError && adverts.length === 0 && (
                <div className="flex flex-col items-center gap-3 bg-accent/10 mx-auto px-5 py-6 border border-border rounded-xl w-full">
                    <Shop className="size-8 text-muted" />
                    <p className="text-foreground/80 text-xs text-center">You haven't created any adverts yet.</p>
                    <button onClick={toggleNew} className="bg-primary hover:bg-primary/90 px-3 py-1 rounded-xl font-semibold text-primary-foreground text-xs transition-colors cursor-pointer">
                        New Advert
                    </button>
                </div>
            )}

            {/* Dots indicator */}
            {!isLoading && adverts.length > 1 && (
                <div className="flex justify-center gap-1.5 mt-4">
                    {adverts.map((_, i: number) => (
                        <button key={i} onClick={() => { setDirection(i > activeIdx ? 1 : -1); setActiveIdx(i); }}
                            className={cn("rounded-full transition-all duration-200",
                                i === activeIdx ? "size-1.5 bg-primary" : "size-1.5 bg-foreground/30"
                            )} />
                    ))}
                </div>
            )}

            {(newAdvert && canCreate) && (
                <Overlay open={newAdvert && canCreate} onClose={toggleNew} variant='bottom'>
                    <AdvertForm onClose={toggleNew} />
                </Overlay>
            )}
        </Card>
    );
}

export default Advert;