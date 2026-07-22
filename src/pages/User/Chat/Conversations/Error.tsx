// UIs
import { Button } from "@/components/ui/button";

// Icons
import { Danger, Refresh2 } from "iconsax-reactjs";


export default function ConvoError({ onRetry }: { onRetry: () => void }) {
    return (
        <div className="flex flex-col justify-center items-center px-4 h-[80vh] text-center">
            <div className="flex justify-center items-center bg-destructive/10 mb-5 rounded-full size-12 md:size-14 xl:size-16">
                <Danger className="size-6 md:size-7 xl:size-8 text-destructive" />
            </div>

            <h2 className="font-semibold text-sm md:text-base xl:text-lg">
                Couldn't load messages
            </h2>

            <p className="mt-2 max-w-sm text-[11px] text-foreground/70 md:text-xs xl:text-sm">
                Something went wrong while loading your conversations.
                Please check your internet connection and try again.
            </p>

            <Button className="mt-6" onClick={onRetry}>
                <Refresh2 className="mr-1 size-4" />
                Try again
            </Button>
        </div>
    );
}