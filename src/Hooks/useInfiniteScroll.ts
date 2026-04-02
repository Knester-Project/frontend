import { useEffect, useRef } from "react";

type UseInfiniteScrollProps = {
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    fetchNextPage: () => void;
    root?: HTMLElement | null;
    rootMargin?: string;
};

const useInfiniteScroll = ({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    root,
    rootMargin = "200px",
}: UseInfiniteScrollProps) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            {
                root,
                rootMargin,
            }
        );

        observer.observe(ref.current);

        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage, root, rootMargin]);

    return ref;
};

export default useInfiniteScroll;