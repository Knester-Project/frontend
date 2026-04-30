import { useForm, useFieldArray } from "react-hook-form";
import { useState, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { sileo } from "sileo";

// Utils, Schemas, Services and Stores
import { cn } from "@/lib/utils";
import { editProfileSchema, mediaFileSchema, type EditProfileInput } from "@/schemas/profile.schema";
import { useSyncProfile } from "@/services/userMutations";
import { cleanUpdateData, makeFilesUnique } from "@/utils/format";
import { usePresignedUpload } from "@/Hooks/usePresignedUpload";
import { useProfileTheme } from "@/stores/profileTheme.store";

// UIs
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import ErrorText from "@/components/ErrorText";

// Icons
import {
    AddSquare, Trash, DirectSend, CloseSquare, GalleryFavorite, Lock, MessageRemove, Calendar1, AlignLeft, Tag, GridLock,
    ProfileTick, GlobalSearch
} from "iconsax-reactjs";
import { Rocket } from "lucide-react";

interface ProfileFormProps {
    isPremium: boolean;
    close: () => void;
    remainingMedia?: number;
    MAX_DETAILS?: number;
    defaultValues?: Partial<EditProfileInput>;
}

export default function ProfileForm({ isPremium, close, remainingMedia = 10, MAX_DETAILS = 4, defaultValues = {} }: ProfileFormProps) {

    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [mediaError, setMediaError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm<EditProfileInput>({
        resolver: zodResolver(editProfileSchema),
        defaultValues: {
            bio: defaultValues.bio ?? "",
            details: defaultValues.details ?? [],
            dateOfBirth: defaultValues.dateOfBirth ?? "",
            profileLock: defaultValues.profileLock ?? false,
            chatLock: defaultValues.chatLock ?? false,
            discoverable: defaultValues.discoverable ?? true,
        },
        mode: "onBlur"
    });

    const { fields: detailFields, append: appendDetail, remove: removeDetail } = useFieldArray({
        control,
        name: "details",
    });

    const profileLock = watch("profileLock");
    const chatLock = watch("chatLock");
    const discoverable = watch("discoverable");

    const canAddDetail = detailFields.length < MAX_DETAILS;
    const canAddMedia = mediaFiles.length < remainingMedia;

    const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setMediaError(null);
        const incoming = Array.from(files);

        // Validate
        const validation = mediaFileSchema.safeParse(incoming);

        if (!validation.success) {
            setMediaError(validation.error.issues[0]?.message ?? "Invalid file");
            // Clear value so they can try again
            e.target.value = "";
            return;
        }

        // Process
        const uniqueIncoming = makeFilesUnique(incoming);

        setMediaFiles((prev) => {
            const combined = [...prev, ...uniqueIncoming];
            return combined.slice(0, remainingMedia);
        });

        // Reset the input so the SAME file can be picked again if deleted
        e.target.value = "";
    };

    const removeMedia = (index: number) => {
        setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    };

    // Presigned url
    const { uploadFiles } = usePresignedUpload();

    const syncProfile = useSyncProfile()
    const handleFormSubmit = async (data: EditProfileInput) => {

        // Make sure there is an actual change 
        if (mediaFiles?.length === 0 && JSON.stringify(defaultValues) === JSON.stringify(data)) {
            return sileo.error({ title: "No Update Found", description: "Kindly Make Some Changes To Continue" })
        }
        try {
            setIsSubmitting(true);
            let media;

            if (mediaFiles && mediaFiles.length > 0) {

                // Validate files
                if (mediaFiles.length > remainingMedia) {
                    sileo.error({
                        title: "Too many files selected",
                        description: `Only ${remainingMedia} remaining — please remove excess media files to reduce your selection`
                    });
                    return;
                }

                // Generate Presigned URL and Upload files
                const uploads = await uploadFiles(mediaFiles, "profile");

                // Attach uploaded media
                media = uploads.map((u) => (u.publicUrl));

                setIsSubmitting(false);
            }

            const cleanedData = cleanUpdateData(data);
            // Update Profile
            const payload = {
                ...cleanedData,
                details: data.details?.map(d => d.value),
                ...(media && { media }),
            };

            syncProfile.mutate(payload, {
                onSuccess: () => {
                    sileo.success({ title: "Profile Updated !!!", icon: <Rocket className="size-3.5" />, });
                    setMediaFiles([]);
                    close();
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onError: (error: any) => {
                    const message = error?.response?.data?.message || "Couldn't update profile now, kindly try again later.";
                    sileo.error({ title: "Error", description: message });
                },
            });
        } catch {
            sileo.error({ title: "Couldn't create post now, kindly try again later." });
        } finally {
            reset();
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* ── Bio ── */}
            <Section icon={AlignLeft} title="Bio">
                <textarea {...register("bio")} rows={3} placeholder="Tell people about yourself…"
                    className={cn(
                        "px-4 py-3 border rounded-xl w-full leading-relaxed resize-none",
                        "placeholder:text-gray-600 placeholder:dark:text-gray-300/50 focus:outline-none transition",
                        errors.bio ? "border-destructive" : "border-input"
                    )}
                />
                {errors.bio && <ErrorText message={errors.bio.message} />}
                <p className="mt-0.5 text-[11px] text-gray-600 dark:text-gray-300 montserrat">Between 3 and 300 characters.</p>
            </Section>

            {/* ── Details ── */}
            <Section icon={Tag} title="Details" badge={`${detailFields.length}/${MAX_DETAILS}`}>
                <div className="space-y-2">
                    <AnimatePresence initial={false}>
                        {detailFields.map((field, i) => (
                            <motion.div key={field.id} initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.18 }} className="flex flex-col my-2">

                                <div className="flex items-center gap-2">
                                    {/* Registered specific `.value` instead of the whole object */}
                                    <input {...register(`details.${i}.value` as const)} placeholder="New Detail"
                                        className={cn("flex-1 bg-background px-4 py-2.5 border rounded-xl",
                                            "placeholder:text-gray-600 placeholder:dark:text-gray-300/50 focus:outline-none transition",
                                            errors.details?.[i]?.value ? "border-destructive" : "border-input"
                                        )} />
                                    <button type="button" onClick={() => removeDetail(i)}
                                        className="flex justify-center items-center hover:bg-destructive/8 rounded-lg size-8 md:size-9 xl:size-10 text-destructive/70 hover:text-destructive transition-colors cursor-pointer">
                                        <Trash className="size-4 md:size-4.5 xl:size-5" />
                                    </button>
                                </div>

                                {/* Target the specific message on the value property */}
                                {errors.details?.[i]?.value && (
                                    <div className="mt-1">
                                        <ErrorText message={errors.details[i]?.value?.message} />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <button type="button" disabled={!canAddDetail}
                    onClick={() => appendDetail({ value: "" })}
                    className={cn("flex items-center gap-1.5 mt-2 px-3 py-2 rounded-lg font-medium text-xs transition-colors cursor-pointer",
                        canAddDetail ? "text-primary hover:bg-primary/8" : "text-gray-600 dark:text-gray-300/40 cursor-not-allowed"
                    )}>
                    <AddSquare className="size-4 md:size-4.5 xl:size-5" />
                    Add detail {!canAddDetail && `(${MAX_DETAILS} max reached)`}
                </button>
            </Section>

            {/* ── Date of Birth ── */}
            {!defaultValues?.dateOfBirth?.trim() &&
                <Section icon={Calendar1} title="Date of Birth">
                    <input type="date"
                        {...register("dateOfBirth")}
                        className={cn("px-4 py-2.5 border rounded-xl w-full", "focus:outline-none transition", errors.dateOfBirth ? "border-destructive" : "border-input")} />
                    {errors.dateOfBirth && <ErrorText message={errors.dateOfBirth.message} />}
                </Section>
            }

            {/* ── Media ── */}
            <Section icon={GalleryFavorite} title="Media" badge={`${mediaFiles.length}/${remainingMedia}`}>
                {mediaFiles.length > 0 && (
                    <div className="gap-2 grid grid-cols-4 sm:grid-cols-6 mb-3">
                        <AnimatePresence>
                            {mediaFiles.map((file, i) => {
                                const url = URL.createObjectURL(file);
                                const isVideo = file.type.startsWith("video/");
                                return (
                                    <motion.div key={file.name + i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }} className="relative bg-muted rounded-lg aspect-square overflow-hidden">
                                        {isVideo ? (
                                            <video src={url} className="w-full h-full object-cover" />
                                        ) : (
                                            <img src={url} alt="" className="w-full h-full object-cover" />
                                        )}
                                        <button type="button" onClick={() => removeMedia(i)}
                                            className="absolute inset-0 flex justify-center items-center bg-black/50 transition-opacity">
                                            <CloseSquare className="size-4 text-destructive cursor-pointer" />
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}

                <label className={cn("flex items-center gap-3 px-4 py-4 border-2 border-dashed rounded-xl transition-colors",
                    canAddMedia
                        ? "cursor-pointer border-border hover:border-primary/40 hover:bg-primary/4"
                        : "cursor-not-allowed border-border/40 opacity-50"
                )}>
                    <DirectSend className="size-4 text-gray-600 dark:text-gray-300 shrink-0" />
                    <div className="flex-1">
                        <p className="font-medium text-[11px] md:text-xs xl:text-sm">
                            {canAddMedia ? "Upload photos or videos" : "No more slots available"}
                        </p>
                        <p className="mt-0.5 text-[11px] text-gray-600 dark:text-gray-300">
                            JPEG, PNG, HEIC, MP4, WebM · Max 40MB each
                        </p>
                    </div>
                    <input type="file" multiple
                        disabled={!canAddMedia}
                        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,video/mp4,video/webm,video/quicktime"
                        onChange={handleMediaChange}
                        className="hidden"
                    />
                </label>
                {mediaError && <div className="mt-2"><ErrorText message={mediaError} /></div>}
            </Section>

            {/* ── Privacy Toggles ── */}
            <Section icon={Lock} title="Privacy">
                <div className="space-y-3">
                    <ToggleRow icon={GlobalSearch} label="Discoverable" description="Allow others to find and send you random chat requests"
                        checked={discoverable!} onChange={(v) => setValue("discoverable", v)} />
                    {isPremium ?
                        <>
                            <ToggleRow icon={GridLock} label="Profile Lock" description="No one can view your profile"
                                checked={profileLock!} onChange={(v) => setValue("profileLock", v)} />

                            <ToggleRow icon={MessageRemove} label="Chat Lock" description="Only previous connections can send you a new message"
                                checked={chatLock!} onChange={(v) => setValue("chatLock", v)} />
                        </>
                        :
                        <div className="py-2 text-[11px] text-primary md:text-xs xl:text-sm montserrat">
                            <p>This Field Is Only Available To Premium/Core/Moderating Users</p>
                        </div>
                    }
                </div>
            </Section>

            {/* ── Submit ── */}
            <Button type="submit" disabled={isSubmitting || syncProfile.isPending} className="shadow-lg shadow-primary/20 rounded-xl w-full h-10 font-semibold text-sm">
                <ProfileTick variant="Bold" />
                {isSubmitting ? (
                    <span className="flex items-center gap-2">
                        <span className="border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full size-4 animate-spin" />
                        Saving…
                    </span>
                ) : (
                    "Save Changes"
                )}
            </Button>
        </form>
    );
}


interface SectionProps {
    icon: React.ElementType;
    title: string;
    badge?: string;
    children: React.ReactNode;
}

function Section({ icon: IconComponent, title, badge, children }: SectionProps) {

    const { colors } = useProfileTheme();

    return (
        <div>
            <div className="flex items-center gap-2 mb-3">
                <div style={{ backgroundColor: colors.primary }} className="flex justify-center items-center rounded-lg size-8 md:size-9 xl:size-10">
                    <IconComponent variant="Bold" style={{ color: colors.isDark ? "white" : "#121212" }} className={`size-4 md:size-4.5 xl:size-5`} />
                </div>
                <span className="font-medium text-[11px] md:text-xs xl:text-sm montserrat">{title}</span>
                {badge != null && (
                    <span className="bg-accent ml-auto px-2 py-0.5 rounded-lg font-medium text-[11px] montserrat">
                        {badge}
                    </span>
                )}
            </div>
            {children}
        </div>
    );
}

interface ToggleRowProps {
    icon: React.ElementType;
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

function ToggleRow({ icon: IconComponent, label, description, checked, onChange }: ToggleRowProps) {

    const id = label.replace(/\s/g, "-").toLowerCase();
    const { colors } = useProfileTheme();

    return (
        <div style={{ backgroundColor: colors.primary }} className="flex items-center gap-4 p-3 rounded-xl">
            <div className="flex justify-center items-center bg-background shadow-sm rounded-lg size-8 md:size-9 xl:size-10 shrink-0">
                <IconComponent className="size-4 md:size-4.5 xl:size-5" />
            </div>
            <div className="flex-1 min-w-0">
                <Label style={{ color: colors.isDark ? "white" : "#121212" }} htmlFor={id} className="font-medium text-[11px] md:text-xs xl:text-sm cursor-pointer montserrat">
                    {label}
                </Label>
                <p style={{ color: colors.isDark ? "white" : "#121212" }} className="mt-0.5 text-[10px] md:text-[11px] xl:text-xs">{description}</p>
            </div>
            <Switch style={{ backgroundColor: colors.isDark ? "white" : "#121212" }} id={id} checked={!!checked} onCheckedChange={onChange} />
        </div>
    );
}
