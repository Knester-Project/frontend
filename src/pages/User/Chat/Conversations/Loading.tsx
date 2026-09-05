//  UIs
import { Skeleton } from "@/components/ui/skeleton";

// Icons
import { MessageAdd1 } from "iconsax-reactjs";

const ConvoLoading = () => {
    return (
        <main>
            <header className="flex justify-between items-center bg-primary/10 p-4 rounded-xl">
                <div>
                    <h1 className="font-bold text-lg md:text-xl xl:text-2xl">Messages</h1>
                    <p className="smallText">Loading Conversations ...</p>
                </div>
                <div className="place-items-center grid bg-background rounded-md size-8 md:size-10 xl:size-12 duration-200 cursor-pointer">
                    <MessageAdd1 className="size-4 md:size-4.5 xl:size-5" />
                </div>
            </header>
            <div className="mt-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-3 px-4 py-3"
                    >
                        {/* Avatar */}
                        <Skeleton className="rounded-full size-12" />

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                                <Skeleton className="rounded-md w-2/3 h-6" />
                            </div>
                            <Skeleton className="mt-2 rounded-md w-full h-3" />
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}

export default ConvoLoading;