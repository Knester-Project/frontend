import { useState } from "react";
// Services
import { useNotification } from "@/services/userQueries";

// Constants, Hooks
import { NOT_LIMIT } from "@/assets/constants";
import useInfiniteScroll from "@/Hooks/useInfiniteScroll";

// UIs
import Empty from "./Empty";
import Header from "./Header";
import NotificationLoader from "./Loader";
import NotificationBox from "@/features/notification/NotificationBox";


const Index = () => {

    const [type, setType] = useState<string>("all");

    const { data,
        fetchNextPage,
        isLoading,
        hasNextPage,
        isFetchingNextPage } = useNotification({ limit: NOT_LIMIT });

    // Pass the active fetch function to your scroll hook
    const loadMoreRef = useInfiniteScroll({
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    });

    const notsData = data?.pages.flatMap((page) => page.data.data) ?? [];

    const nots = type === "all" ? notsData : notsData.filter((notification) => notification.type === type)
    const nextCursor = data?.pages[0]?.data?.nextCursor || null;

    return (
        <main>
            <Header type={type} update={setType} />
            {isLoading ? (
                <main className="mt-10 px-[1rem] sm:px-8 md:px-[3rem] lg:px-[4rem] 2xl:px-[6rem] xl:px-[5rem]">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <NotificationLoader key={i} />
                    ))}
                </main>

            ) : nots.length === 0 ? (
                <Empty />
            ) : (
                <>
                    <main className="flex flex-col gap-y-2 mt-10 px-[1rem] sm:px-8 md:px-[3rem] lg:px-[4rem] 2xl:px-[6rem] xl:px-[5rem]">
                        {nots.map((not) => (
                            <NotificationBox key={not._id} notification={not} nextCursor={nextCursor} />
                        ))}
                    </main>

                    {/* Loading next page */}
                    {isFetchingNextPage && (
                        <div className="gap-5 columns-1 md:columns-2">
                            {Array.from({ length: 2 }).map((_, i) => (
                                <NotificationLoader key={i} />
                            ))}
                        </div>
                    )}

                    {/* No more data */}
                    {!hasNextPage && nots.length > 0 && (
                        <p className="py-4 font-medium text-foreground/80 text-xs text-center">
                            You've caught up on all Notifications!
                        </p>
                    )}

                    {/* Intersection trigger */}
                    <div ref={loadMoreRef} className="w-full h-4" />
                </>
            )}
        </main>
    );
}

export default Index;