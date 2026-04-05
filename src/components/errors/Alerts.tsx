// Icons
import { Loader2, X } from "lucide-react";

export function ConnectionLost({ onDismiss }: { onDismiss: () => void }) {
    return (
        <div className="flex items-center gap-3 bg-foreground shadow-lg mx-auto px-5 py-2.5 rounded-full max-w-sm text-background">
            <Loader2 className="flex-shrink-0 opacity-70 size-4 animate-spin" />
            <span className="flex-1 font-medium text-[11px] md:text-xs xl:text-sm">Connection lost. Retrying...</span>
            <button onClick={onDismiss} className="bg-primary hover:bg-primary/90 px-3 py-1 rounded-full font-semibold text-primary-foreground text-xs transition-colors cursor-pointer">
                DISMISS
            </button>
        </div>
    );
}

export function UploadFailed({ onRetry }: { onRetry: () => void }) {
    return (
        <div className="flex items-center gap-3 bg-foreground shadow-lg mx-auto px-5 py-2.5 rounded-full max-w-sm text-background">
            <div className="flex flex-shrink-0 justify-center items-center bg-destructive/20 rounded-full size-5">
                <X className="size-3 text-destructive" />
            </div>
            <span className="flex-1 font-medium text-[11px] md:text-xs xl:text-sm">Unable to upload image</span>
            <button onClick={onRetry} className="bg-primary hover:bg-primary/90 px-3 py-1 rounded-full font-semibold text-primary-foreground text-xs transition-colors cursor-pointer">
                TRY AGAIN
            </button>
        </div>
    );
}