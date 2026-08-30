import { Warning2, Refresh2 } from "iconsax-reactjs";

// UIs
import { Button } from "@/components/ui/button";


export default function AdvertError({ refetch }: { refetch: () => void }) {
    return (
        <div className="flex flex-col justify-center items-center bg-background p-6 border border-border border-dashed rounded-3xl w-full h-[280px]">
            {/* Error Icon */}
            <Warning2
                className="mb-3 size-10 text-destructive"
                variant="Bulk"
            />

            {/* Error Message */}
            <p className="mb-1 font-medium text-foreground text-center montserrat">
                Failed to load advert
            </p>
            <p className="mb-5 max-w-[200px] text-[11px] text-foreground/60 md:text-xs xl:text-sm text-center">
                We encountered an error while fetching the advert details.
            </p>

            {/* Refetch Action */}
            <Button
                variant="outline"
                size="sm"
                onClick={refetch}
                className="gap-2 hover:bg-muted rounded-xl transition-all"
            >
                <Refresh2 className="size-4" />
                <span>Try Again</span>
            </Button>
        </div>
    );
}