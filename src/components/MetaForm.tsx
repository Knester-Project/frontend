import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import { sileo } from "sileo";
import { Route } from "@/routes/_dashboard/messages";

// Schemas, Utils
import { metaSchema, type MetaInput } from "@/schemas/metaForm.schema";
import { cn } from "@/lib/utils";
import { getChangedValues } from "@/utils/generate";
import { useUpdateConvMeta } from "@/services/userMutations";
import { usePresignedUpload } from "@/Hooks/usePresignedUpload";

// UIs
import { Label } from "./ui/label";
import ErrorText from "./ErrorText";
import ZodInput from "./ZodInput";
import Button from "./Button";

// Icons
import { Loader2 } from "lucide-react";
import { GalleryAdd, GalleryEdit, Global, Lock, TickCircle } from "iconsax-reactjs";


const TTL_OPTIONS = [
    { label: "24 hours", sub: "Default", value: 86400 },
    { label: "3 days", sub: "72 hours", value: 259200 },
    { label: "7 days", sub: "Maximum", value: 604800 },
];

const MAX_FILE_SIZE_MB = 5;

type MetaFormType = {
    meta: Omit<Meta, "createdAt" | "owner">,
    conversationId: string | null,
    isPrivate: boolean,
    onClose: () => void,
}

const MetaForm = ({ meta, conversationId, isPrivate, onClose }: MetaFormType) => {

    const { username } = Route.useSearch();
    const [newFile, setNewFIle] = useState<File | null>(null);
    const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(metaSchema),
        defaultValues: {
            name: meta.name.trim() ? meta.name : undefined,
            avatar: meta.avatar.trim() ? meta.avatar : undefined,
            type: meta.type === "public" || meta.type === "private" ? meta.type : "private",
            messageTtl: Number(meta.messageTtl ?? 86400),
        },
    });

    const avatar = watch("avatar");
    const type = watch("type");
    const messageTtl = watch("messageTtl");

    // Functions
    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            sileo.error({ title: "Unsupported Media type" });
            return false;
        }

        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            sileo.error({ title: `File exceeds ${MAX_FILE_SIZE_MB}MB` });
            return false;
        }
        setNewFIle(file)

        const nextUrl = URL.createObjectURL(file);
        setValue("avatar", nextUrl, { shouldValidate: true });

        // allow picking the same file again
        e.target.value = "";
    };

    const { uploadFiles } = usePresignedUpload();
    const updateMeta = useUpdateConvMeta(username || "")
    const submit: SubmitHandler<MetaInput> = async (data) => {

        if (!conversationId) return sileo.error({ title: "Conversation Not Found" })

        try {
            let mediaUrls: string[] = [];

            if (avatar && newFile) {
                const uploads = await uploadFiles([newFile], "post");
                mediaUrls = uploads.map((u) => u.publicUrl);
            }

            const changedValues = getChangedValues(meta, data);
            const payload: EditConvMetaPayload = { conversationId, ...changedValues }
            if (avatar && newFile) payload.avatar = mediaUrls[0];

            await updateMeta.mutateAsync(payload);
            sileo.success({ title: "Conversation details was updated successfully" });
            onClose()

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const message = error?.response?.data?.message || "Couldn't update conversation now.";
            sileo.error({ title: "Update Failed", description: message });
        }
    }

    return (
        <main>
            <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-6">
                {/* Avatar */}
                <div className="flex flex-col gap-2">
                    <Label>Chat avatar</Label>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="flex justify-center items-center bg-muted border border-border rounded-2xl size-20 md:size-22 xl:size-24 overflow-hidden">
                                {isSubmitting ? (
                                    <Loader2 className="size-5 md:size-5.5 xl:size-6 text-muted-foreground animate-spin" />
                                ) : avatar ? (
                                    <img src={avatar} alt="Chat avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <GalleryEdit className="size-5 md:size-5.5 xl:size-6 text-muted-foreground/60" />
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className={cn(
                                "inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer",
                                "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            )}>
                                <GalleryAdd className="size-4 md:size-4.5 xl:size-5" />
                                {avatar ? "Change image" : "Upload image"}
                                <input type="file" accept="image/*" className="sr-only" onChange={handleAvatarUpload} disabled={isSubmitting || !conversationId} />
                            </label>
                            {errors.avatar && <ErrorText message={errors.avatar.message} />}
                        </div>
                    </div>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-2">
                    <ZodInput name="name" type="text" disabled={isSubmitting || !conversationId} label="Chat Name" id="chat-name" placeholder="e.g. My Kidney" register={register} />
                    {errors.name && <ErrorText message={errors.name.message} />}
                </div>

                {/* Type */}
                {!isPrivate && <div className="flex flex-col gap-2">
                    <Label>Visibility</Label>
                    <div className="gap-3 grid grid-cols-2">
                        {[
                            { value: "public", icon: Global, label: "Public", desc: "Anyone can join" },
                            { value: "private", icon: Lock, label: "Private", desc: "Invite only" },
                        ].map(({ value, icon: Icon, label, desc }) => {
                            const active = type === value;
                            return (
                                <button
                                    key={value}
                                    type="button"
                                    disabled={isSubmitting || !conversationId}
                                    onClick={() => setValue("type", value as "private" | "public", { shouldValidate: true })}
                                    className={cn(
                                        "relative flex flex-col gap-1 p-3 border rounded-2xl text-left transition-all",
                                        active ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                                    )}
                                >
                                    <Icon className={cn("size-3 md:size-3.5 xl:size-4", active ? "text-primary" : "text-muted-foreground")} />
                                    <span className="font-semibold smallText">{label}</span>
                                    <span className="text-[10px] text-muted-foreground md:text-[11px] xl:text-xs">{desc}</span>
                                    {active && (
                                        <span className="top-2 right-2 absolute flex justify-center items-center bg-primary rounded-full size-6 md:size-7 xl:size-8">
                                            <TickCircle className="size-3 md:size-3.5 xl:size-4 text-primary-foreground" />
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
                }

                {/* Message TTL */}
                <div className="flex flex-col gap-2">
                    <Label>Message auto-delete</Label>
                    <p className="-mt-1 text-[10px] text-muted-foreground md:text-[11px] xl:text-xs">Messages disappear after the selected time.</p>
                    <div className="gap-2.5 grid grid-cols-3">
                        {TTL_OPTIONS.map((opt) => {
                            const active = Number(messageTtl) === opt.value;
                            return (
                                <motion.button
                                    key={opt.value}
                                    type="button"
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => setValue("messageTtl", opt.value, { shouldValidate: true })}
                                    disabled={isSubmitting || !conversationId}
                                    className={cn(
                                        "flex flex-col items-center gap-0.5 px-2 py-3 border rounded-xl transition-all cursor-pointer",
                                        active ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                                    )}
                                >
                                    <span className={cn("font-semibold smallText", active ? "text-primary" : "text-foreground")}>{opt.label}</span>
                                    <span className="text-[9px] text-muted-foreground md:text-[10px] xl:text-[11px]">{opt.sub}</span>
                                </motion.button>
                            );
                        })}
                    </div>
                    {errors.messageTtl && (
                        <ErrorText message={errors.messageTtl.message} />
                    )}
                </div>
                <Button type="submit" text="Update Details" disabled={isSubmitting || !conversationId} loading={isSubmitting} />
            </form>
        </main>
    );
}

export default MetaForm;