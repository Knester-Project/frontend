import { useEffect, useRef } from "react";

type UseInfiniteScrollProps = {
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    fetchNextPage: () => void;
    rootMargin?: string;
};

const useInfiniteScroll = ({ hasNextPage, isFetchingNextPage, fetchNextPage, rootMargin = "200px" }: UseInfiniteScrollProps) => {

    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {

        if (!ref.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];

                if (
                    entry.isIntersecting &&
                    hasNextPage &&
                    !isFetchingNextPage
                ) {
                    fetchNextPage();
                }
            },
            { rootMargin }
        );

        observer.observe(ref.current);

        return () => {
            observer.disconnect();
        };
    }, [fetchNextPage, hasNextPage, isFetchingNextPage, rootMargin]);

    return ref;
};

export default useInfiniteScroll;