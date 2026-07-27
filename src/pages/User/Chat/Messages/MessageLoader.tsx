import { Skeleton } from "@/components/ui/skeleton";

function Bubble({ me, lines = 2 }: { me: boolean; lines?: number }) {
    return (
        <div className={`max-w-[75%] ${me ? "ml-auto" : ""}`}>
            <div className="p-4 border border-border rounded-3xl">
                <Skeleton className="rounded-full w-full h-3" />

                {lines > 1 && (
                    <>
                        <Skeleton className="mt-2 rounded-full w-[90%] h-3" />
                        <Skeleton className="mt-2 rounded-full w-[60%] h-3" />
                    </>
                )}
            </div>

            <div className={`mt-2 flex ${me ? "justify-end" : "justify-start"}`}>
                <Skeleton className="w-10 h-3" />
            </div>
        </div>
    );
}

export function MessagesSkeleton() {
    return (
        <div className="space-y-5 p-4">
            <Bubble me={false} />
            <Bubble me={true} />
            <Bubble me={true} lines={1} />
            <Bubble me={false} />
            <Bubble me={false} lines={1} />
            <Bubble me={true} />
            <Bubble me={false} />
        </div>
    );
}