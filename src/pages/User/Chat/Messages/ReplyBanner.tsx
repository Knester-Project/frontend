// Icons
import { CloseSquare } from "iconsax-reactjs";

type ReplyType = {
    replyingTo: string;
    replyPreview: string;
    clearState: () => void;
}

const ReplyBanner = ({ replyingTo, replyPreview, clearState }: ReplyType) => {
    return (
        <main className="flex items-center gap-2 bg-muted/40 px-4 py-2 border-border border-b">
            <div className="flex-1 pl-2 border-primary border-l-4 min-w-0">
                <p className="font-semibold text-[10px] text-primary md:text-[11px] xl:text-xs truncate capitalize">
                    {replyingTo === "You" ? "You" : `Replying to ${replyingTo}`}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground md:text-xs xl:text-sm truncate">
                    {replyPreview || "..."}
                </p>
            </div>
            <button onClick={clearState} className="p-1 rounded-full cursor-pointer">
                <CloseSquare className="size-3 md:size-3.5 xl:size-4 text-muted-foreground hover:text-destructive duration-200" />
            </button>
        </main>
    );
}

export default ReplyBanner;