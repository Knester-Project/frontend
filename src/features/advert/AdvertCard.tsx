import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { sileo } from "sileo";

// Enums, Utils and Services
import { ADVERT_STATUS_META } from "@/enums";
import { cn } from "@/lib/utils";
import { formatAmount } from "@/utils/format";
import { useDeleteAdvert } from "@/services/userMutations";

// UIs
import AdvertEdit from "./AdvertEdit";
import { Overlay } from "../../components/common/Overlay";

//  Icons
import { ArrowLeft3, ArrowRight3, Edit, Image, Messages2, PenTool, Tag2, Trash } from "iconsax-reactjs";

const AdvertCard = ({ advert, isOwner }: { advert: MyAdvert, isOwner: boolean }) => {

    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [showAllCategories, setShowAllCategories] = useState<boolean>(false);
    const [editing, setEditing] = useState<MyAdvert | null>(null);

    const images = advert.mediaUrls || [];
    const hasImages = images.length > 0;
    const status = ADVERT_STATUS_META[advert.status as keyof typeof ADVERT_STATUS_META] ?? ADVERT_STATUS_META.active;

    // --- Interaction Handlers ---
    // Make sure we stop propagation so clicking the buttons doesn't click the whole card
    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const toggleCategories = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowAllCategories((prev) => !prev);
    };

    // Handle Deletion
    const deleteAdvert = useDeleteAdvert();
    const handleDeletion = () => {
        sileo.action({
            title: "Advert Deletion",
            description: "Do you wish to delete this advert?",
            button: {
                title: "Delete",
                onClick: () => {
                    deleteAdvert.mutate(advert._id,
                        {
                            onSuccess: () => {
                                sileo.success({
                                    title: "Advert Was Deleted !!!",
                                    description: "The Advert has been removed from the list of adverts."
                                });
                            },
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            onError: (error: any) => {
                                const message = error?.response?.data?.message || "Couldn't advert now, kindly try again later.";
                                sileo.error({ title: "Error", description: message });
                            },
                        }
                    );
                },
            },
        });
    }

    return (
        <>
            {!!editing && (
                <Overlay open={!!editing} onClose={() => setEditing(null)}>
                    <AdvertEdit advert={editing} onClose={() => setEditing(null)} />
                </Overlay>
            )}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col bg-card shadow-sm border border-border/60 rounded-3xl overflow-hidden"
            >
                {/* Thumbnail Carousel Section */}
                <div className="group relative bg-muted h-48 overflow-hidden shrink-0">
                    {hasImages ? (
                        <img src={images[currentImageIndex]} alt={advert.title} className="w-full h-full object-cover transition-opacity duration-300" />
                    ) : (
                        <div className="flex flex-col justify-center items-center gap-2 bg-green-300 dark:bg-green-900 w-full h-full text-foreground/70">
                            <Image className="size-8" />
                            <span className="text-xs">No media</span>
                        </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent pointer-events-none" />

                    {/* Carousel Controls (Only show if top card and has multiple images) */}
                    {(images.length > 1) && (
                        <>
                            <button onClick={handlePrevImage}
                                className="top-1/2 left-2 absolute bg-background/50 hover:bg-background/80 opacity-100 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:opacity-0 backdrop-blur-sm p-1 rounded-full text-foreground transition-all -translate-y-1/2 cursor-pointer">
                                <ArrowLeft3 className="size-4" />
                            </button>

                            <button onClick={handleNextImage}
                                className="top-1/2 right-2 absolute bg-background/50 hover:bg-background/80 opacity-100 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:opacity-0 backdrop-blur-sm p-1 rounded-full text-foreground transition-all -translate-y-1/2 cursor-pointer">
                                <ArrowRight3 className="size-4" />
                            </button>

                            {/* Image Indicators (Dots) */}
                            <div className="bottom-2 left-1/2 z-10 absolute flex gap-1.5 -translate-x-1/2">
                                {images.map((_, idx) => (
                                    <div key={idx} className={cn("rounded-full h-1.5 transition-all duration-300",
                                        idx === currentImageIndex ? "w-4 bg-primary" : "w-1.5 bg-primary/30")} />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Status badge */}
                    <span className={cn("top-3 right-3 absolute backdrop-blur-sm px-2.5 py-1 border rounded-full font-semibold text-[9px] md:text-[10px] xl:text-[11px]", status.color)}>
                        {status.label}
                    </span>

                    {/* Type badge */}
                    <span className="top-3 left-3 absolute flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2.5 py-1 border border-border/40 rounded-full font-semibold text-[9px] text-foreground md:text-[10px] xl:text-[11px]">
                        {advert.type === "good" ? <Tag2 className="size-3" /> : <PenTool className="size-3" />}
                        {advert.type === "good" ? "Good" : "Service"}
                    </span>
                </div>

                {/* Body Section */}
                <div className="flex flex-col flex-1 px-5 pt-4 pb-5">
                    <div className="mb-3">
                        <h3 className="font-bold text-foreground line-clamp-1 leading-snug">{advert.title}</h3>
                        <p className="mt-1 text-[10px] text-foreground/80 md:text-[11px] xl:text-xs line-clamp-2 leading-relaxed">{advert.description}</p>
                    </div>

                    {/* Categories Section (Scrollable when expanded) */}
                    {advert.categories?.length > 0 && (
                        <div className={cn("flex flex-wrap gap-1 mb-auto", showAllCategories ? "max-h-[5rem] hide-scrollbar overflow-y-auto pr-1" : "")}>
                            {showAllCategories ? (
                                // Show ALL categories
                                <>
                                    {advert.categories.map((c: string) => (
                                        <span key={c} className="bg-accent px-2 py-0.5 rounded-md font-medium text-[8px] md:text-[9px] xl:text-[10px] text-accent-foreground shrink-0">
                                            {c}
                                        </span>
                                    ))}
                                    {/* Collapse button */}
                                    <button onClick={toggleCategories} className="bg-destructive/10 hover:bg-destructive/20 px-2 py-0.5 rounded-md font-bold text-[9px] text-destructive md:text-[10px] xl:text-[11px] transition-colors cursor-pointer shrink-0">
                                        Show Less
                                    </button>
                                </>
                            ) : (
                                // Show TRUNCATED categories
                                <>
                                    {advert.categories.slice(0, 3).map((c: string) => (
                                        <span key={c} className="bg-accent px-2 py-0.5 rounded-md font-medium text-[8px] md:text-[9px] xl:text-[10px] text-accent-foreground shrink-0">
                                            {c}
                                        </span>
                                    ))}
                                    {advert.categories.length > 3 && (
                                        <button onClick={toggleCategories} className="bg-primary/10 hover:bg-primary/20 px-2 py-0.5 rounded-md font-bold text-[9px] text-primary md:text-[10px] xl:text-[11px] transition-colors cursor-pointer shrink-0">
                                            +{advert.categories.length - 3}
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* Footer Section */}
                    <div className="flex justify-between items-center mt-2 pt-3 border-border/40 border-t shrink-0">
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[11px] text-primary md:text-xs xl:text-sm montserrat">{formatAmount(advert.averagePrice)}</span>
                            <span className="text-[9px] text-foreground/80 md:text-[10px] xl:text-[11px]">avg</span>
                        </div>

                        {/* Conditional Action Buttons */}
                        {isOwner ? (
                            <div className="flex items-center gap-x-2">
                                <button onClick={handleDeletion}
                                    className="flex items-center gap-1.5 hover:bg-destructive/20 px-3 py-1.5 border border-destructive hover:border-destructive/80 rounded-xl font-medium text-[10px] text-destructive/70 md:text-[11px] hover:text-destructive xl:text-xs transition-all cursor-pointer">
                                    <Trash className="size-3" />
                                    Delete
                                </button>

                                <button onClick={() => setEditing(advert)}
                                    className="flex items-center gap-1.5 hover:bg-accent/20 px-3 py-1.5 border border-border hover:border-border/80 rounded-xl font-medium text-[10px] text-foreground/70 md:text-[11px] hover:text-foreground xl:text-xs transition-all cursor-pointer">
                                    <Edit className="size-3" />
                                    Edit
                                </button>
                            </div>
                        ) : (
                            <Link to="/messages" search={{ username: advert.vendorId.username, group: undefined }}
                                className="flex items-center gap-1.5 bg-primary/10 hover:bg-primary shadow-sm px-3 py-1.5 rounded-xl font-bold text-[10px] text-primary md:text-[11px] hover:text-primary-foreground xl:text-xs transition-colors cursor-pointer">
                                <Messages2 className="size-3" />
                                Chat
                            </Link>
                        )}
                    </div>
                </div>
            </motion.div >
        </>
    );
}

export default AdvertCard;