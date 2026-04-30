import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Schemas and Constants
import { replySchema, type ReplyInput } from "@/schemas/comment.schema";
import { useAddReply } from "@/services/userMutations";
import { REPLIES_LIMIT } from "@/assets/constants";

// UIs
import ErrorText from "./ErrorText";

// Icons
import { Send2 } from "iconsax-reactjs";

const CommentReply = ({ id, type, username, handleNewReply }: { id: string, type: "comment" | "reply", username: string, handleNewReply: (newReplies: Reply[]) => void }) => {

    const [replyError, setReplyError] = useState<string | null>(null);
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
        resolver: zodResolver(replySchema), reValidateMode: "onBlur"
    });

    const contentValue = watch("content") || "";

    // Functions
    const addReply = useAddReply({ id, type, limit: REPLIES_LIMIT });
    const onSubmit = async (data: ReplyInput) => {

        // Generate Payload
        const payload = {
            content: data.content,
            commentId: type === "comment" ? id : undefined,
            parentReplyId: type === "reply" ? id : undefined,
        }

        addReply.mutate(payload, {
            onSuccess: (response) => {
                handleNewReply([response.data])
                reset();
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (error: any) => {
                const message = error?.response?.data?.message || `Couldn't add reply to ${username}'s ${type} now, kindly try again later.`;
                setReplyError(message);
                setTimeout(() => setReplyError(null), 15000);
                reset();
            },
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-1 mt-4">

            {replyError && <ErrorText message={replyError} />}

            <p className="text-[10px] md:text-[11px] xl:text-xs">Replying to <span className="font-semibold text-primary">{username}</span></p>

            <div className="relative flex items-center gap-x-3 bg-background p-2 border border-border focus-within:border-primary/50 rounded-2xl transition-colors">
                <textarea  {...register("content")} placeholder={addReply.isPending ? "Replying..." : "Write a reply..."} rows={1} className={`flex-1 bg-transparent px-2 py-2 border-none outline-none focus:ring-0 max-h-44 resize-none hide-scrollbar ${addReply.isPending ? "opacity-60 cursor-not-allowed" : ""
                    }`} onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = "auto";
                        target.style.height = `${target.scrollHeight}px`;
                    }} />

                <button disabled={contentValue.length === 0 || contentValue.length > 200 || addReply.isPending} type="submit"
                    className="bg-primary disabled:opacity-50 disabled:grayscale p-1.5 rounded-full transition-all cursor-pointer">
                    <Send2 variant="Bold" className="size-5" />
                </button>
            </div>

            {/* Validation and Error Messages */}
            <div className="flex justify-between px-2">
                <span className={`montserrat ${contentValue.length > 200 ? "text-destructive"
                    : contentValue.length > 180 ? "text-yellow-500" : ""}`}>
                    {contentValue.length}/200
                </span>
                {errors.content && <ErrorText message={errors.content.message} />}
            </div>
        </form>

    );
}

export default CommentReply;