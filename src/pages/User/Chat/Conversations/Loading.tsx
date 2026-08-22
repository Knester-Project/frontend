//  UIs
import { Skeleton } from "@/components/ui/skeleton";

// Icons
import { MessageAdd1 } from "iconsax-reactjs";

const ConvoLoading = () => {
    return (
        <main className="px-[1rem] sm:px-8 md:px-[3rem] lg:px-[4rem] 2xl:px-[6rem] xl:px-[5rem] py-3">
            <header className="flex justify-between items-center bg-primary/10 p-4 rounded-xl">
                <div>
                    <h1 className="font-bold text-lg md:text-xl xl:text-2xl">Messages</h1>
                    <p className="smallText">Loading Conversations ...</p>
                </div>
                <div className="place-items-center grid bg-background rounded-md size-8 md:size-10 xl:size-12 duration-200 cursor-pointer">
                    <MessageAdd1 className="size-4 md:size-5 xl:size-6" />
                </div>
            </header>
            <div className="mt-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-3 px-4 py-3"
                    >
                        {/* Avatar */}
                        <Skeleton className="rounded-full w-12 h-12" />

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                                <Skeleton className="rounded-md w-24 h-4" />
                                <Skeleton className="rounded-md w-10 h-3" />
                            </div>

                            <Skeleton className="mt-2 rounded-md w-[70%] h-3" />
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}

export default ConvoLoading;