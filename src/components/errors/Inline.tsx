// Icons
import { AlertCircle, AlertTriangle } from "lucide-react";

export function UpdateFailed({ message }: { message: string }) {
    return (
        <div className="bg-background shadow-sm p-4 border border-border rounded-3xl">
            <div className="flex items-start gap-3">
                <div className="flex flex-shrink-0 justify-center items-center bg-destructive/30 mt-0.5 rounded-full size-7">
                    <AlertCircle className="size-4 text-destructive" />
                </div>
                <div>
                    <p className="font-semibold text-[11px] text-destructive-foreground md:text-xs xl:text-sm">Update Failed</p>
                    <p className="mt-1 text-[10px] text-gray-600 md:text-[11px] dark:text-gray-300 xl:text-xs leading-relaxed montserrat">
                        {message || "We couldn't save your profile changes. Please check your connection and try again."}
                    </p>
                </div>
            </div>
        </div>
    );
}

export function Storage({ percentage = 90 }) {
    return (
        <div className="bg-background shadow-sm p-4 border border-border rounded-xl">
            <div className="flex items-start gap-3">
                <div className="flex flex-shrink-0 justify-center items-center bg-primary/30 mt-0.5 rounded-full size-7">
                    <AlertTriangle className="size-4 text-primary" />
                </div>
                <div>
                    <p className="font-semibold text-[11px] md:text-xs xl:text-sm">Storage Almost Full</p>
                    <p className="mt-1 text-[10px] text-gray-600 md:text-[11px] dark:text-gray-300 xl:text-xs leading-relaxed montserrat">
                        You have reached {percentage}% of your curation storage. Consider upgrading
                        for unlimited collections.
                    </p>
                </div>
            </div>
        </div>
    );
}
