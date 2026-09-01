// Hooks
import { useChatActions } from "@/Hooks/chats/useChatActions";

// Icons
import { CloseCircle, Danger, Trash } from "iconsax-reactjs";

const Confirmation = ({ type, conversationId, onClose }: { type: "clear" | "delete", conversationId: string | null, onClose: () => void; }) => {

    const { clearChat, isClearing, deleteChat, isDeleting } = useChatActions(conversationId ?? "");

    if (conversationId === null) return null;

    return (
        <div className="py-4 rounded-2xl w-full" role="dialog" aria-modal="true" aria-labelledby="chat-action-title" >
            {/* Icon */}
            <div className="flex justify-center items-center bg-destructive/10 mb-5 border border-destructive/10 rounded-full size-10 md:size-11 xl:size-12">
                <Danger variant="Bold" className="size-5 md:size-5.5 xl:size-6 text-destructive" />
            </div>
            {/* Header */}
            <div className="flex justify-between items-start gap-4 mb-3">
                <div>
                    <h2 id="chat-action-title" className="font-semibold text-sm md:text-base xl:text-lg" >
                        {type === "clear" ? "Clear this chat?" : "Delete this chat?"}
                    </h2>
                    <p className="mt-1 text-muted-foreground leading-6 smallText">
                        Please read carefully before continuing.
                    </p>
                </div>
                <button type="button" onClick={onClose} disabled={isClearing || isDeleting} aria-label="Close" className="hover:bg-destructive/5 disabled:opacity-50 p-1 rounded-lg text-destructive/60 hover:text-destructive transition cursor-pointer disabled:cursor-not-allowed shrink-0" >
                    <CloseCircle className="size-4 md:size-4.5 xl:size-5" variant="Linear" />
                </button>
            </div>
            {/* Description */}
            <div className="bg-destructive/5 p-4 rounded-xl">
                <div className="space-y-3 text-destructive-foreground leading-6 smallText">
                    {type === "clear" ?
                        <>
                            <p>
                                This will clear the messages from your side of the conversation.
                            </p>
                            <p>
                                The messages will still remain available to the other person or people in the chat. Clearing the conversation only affects what you see.
                            </p>
                            <p>
                                If you want to remove a particular message instead, press and hold that message for about a second and choose the delete option.
                            </p>
                            <p className="font-semibold">
                                Make sure you want to continue before selecting “Yes”.
                            </p>
                        </>
                        :
                        <>
                            <p>
                                This will permanently remove this chat from your chat list, including all messages and other chat content on your end.
                            </p>
                            <p>
                                This action only affects your side of the conversation. The other person or people in this chat will not be affected. Their copy of the conversation, including the messages they sent, will remain available to them.
                            </p>
                            <p className="font-semibold">
                                This action cannot be undone from your side.
                            </p>
                        </>
                    }
                </div>
            </div>
            {/* Actions */}
            <div className="flex justify-end items-center gap-x-3 mt-6">
                <button type="button" onClick={onClose} disabled={isDeleting || isClearing} className="hover:bg-destructive/5 disabled:opacity-50 px-4 py-2.5 border border-destructive/10 rounded-xl text-destructive transition cursor-pointer disabled:cursor-not-allowed smallText" >
                    Close
                </button>
                <button type="button" onClick={type === "clear" ? clearChat : deleteChat} disabled={isDeleting || isClearing} className="flex items-center gap-x-2 bg-primary hover:opacity-90 disabled:opacity-50 px-4 py-2.5 rounded-xl text-primary-foreground transition cursor-pointer disabled:cursor-not-allowed smallText" >
                    {isDeleting || isClearing ? "Please wait..." : "Continue"}
                    <Trash className="size-3 md:size-3.5 xl:size-4" />
                </button>
            </div>
        </div>
    );
}

export default Confirmation;