import { useState } from "react";
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { sileo } from "sileo";

// Schemas, Services and utils
import { newAdvertSchema, type NewAdvertPayload } from "@/schemas/advert.schema";
import { useUpdateAdvert, useUpdateAdvertMedia } from "@/services/userMutations";
import { usePresignedUpload } from "@/Hooks/usePresignedUpload";
import { areCategoriesValid } from "@/utils/format";
import { cn } from "@/lib/utils";
import { getDirtyValues } from "@/utils/generate";

// UIs
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ErrorText from "@/components/errors/ErrorText";
import { Label } from "@/components/ui/label";
import FileUploader from "@/features/media/FileUploader";
import CategorySelector from "@/features/advert/AdvertCategories";

// Icons
import { Loader2 } from "lucide-react";
import { CloseSquare, Edit } from "iconsax-reactjs";
import MediaGridEditor from "../media/MediaGridEditor";

type UpdateAdvertProps = {
    advert: MyAdvert;
    onClose: () => void;
};

const AdvertEdit = ({ advert, onClose }: UpdateAdvertProps) => {


    const [files, setFiles] = useState<File[]>([]);

    // Initialize state with existing categories
    const [categories, setCategories] = useState<string[]>(advert.categories);
    const [currentMedia, setCurrentMedia] = useState<string[]>(advert.mediaUrls)

    // Initialize RHF with defaultValues from the existing advert
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, dirtyFields, isDirty, isSubmitting }
    } = useForm<NewAdvertPayload>({
        resolver: zodResolver(newAdvertSchema),
        mode: "onBlur",
        defaultValues: {
            title: advert.title,
            description: advert.description,
            type: advert.type,
            averagePrice: advert.averagePrice,
            status: advert.status,
        }
    });

    const descriptionValue = watch("description") || "";
    const descriptionLength = descriptionValue.length;
    const REMAINING_MEDIA = 5 - advert.mediaUrls.length;

    const { uploadFiles } = usePresignedUpload();
    const updateAdvert = useUpdateAdvert();

    const onSubmit: SubmitHandler<NewAdvertPayload> = async (data) => {

        const hasNewMedia = files.length > 0;
        const hasCategoriesChanged = JSON.stringify(categories) !== JSON.stringify(advert.categories);

        // If nothing changed, prevent unnecessary API calls
        if (!isDirty && !hasNewMedia && !hasCategoriesChanged) {
            sileo.info({ title: "No changes detected." });
            onClose();
            return;
        }

        // Validate Categories
        if (!categories.length) {
            return sileo.error({ title: "Please select at least one category." });
        }
        if (!areCategoriesValid(categories)) {
            return sileo.error({ title: "Please select valid categories." });
        }

        try {
            let mediaUrls = advert.mediaUrls;

            if (hasNewMedia) {
                const uploads = await uploadFiles(files, "post");
                mediaUrls = uploads.map((u) => u.publicUrl);
            }

            const dirtyData = getDirtyValues(dirtyFields, data);
            const payload: EditAdvertPayload = { id: advert._id, ...dirtyData };

            if (hasCategoriesChanged) payload.categories = categories;
            if (hasNewMedia) payload.mediaUrls = mediaUrls;

            await updateAdvert.mutateAsync(payload);
            sileo.success({ title: "Advert updated successfully", icon: <Edit className="size-3.5" /> });
            onClose();
            
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const message = error?.response?.data?.message || "Couldn't update advert now.";
            sileo.error({ title: "Update Failed", description: message });
        }
    };

    const mediaUpdate = useUpdateAdvertMedia();
    const handleMediaDelete = (url: string) => {
        sileo.action({
            title: "File Deletion",
            description: "Do you wish to delete this file?",
            button: {
                title: "Delete",
                onClick: () => {
                    mediaUpdate.mutate(
                        { url, advertId: advert._id },
                        {
                            onSuccess: () => {
                                setCurrentMedia((prev) => prev.filter((img) => img !== url));
                                sileo.success({
                                    title: "Media Deleted !!!",
                                    description: "The Media has been removed from your advert."
                                });
                            },
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            onError: (error: any) => {
                                const message = error?.response?.data?.message || "Couldn't delete media now, kindly try again later.";
                                sileo.error({ title: "Error", description: message });
                            },
                        }
                    );
                },
            },
        });
    };

    return (
        <main className="flex flex-col h-full">
            {/* Header section */}
            <header className="flex justify-between items-center mb-6 shrink-0">
                <div>
                    <h2 className="font-bold text-sm md:text-base xl:text-lg">Update Advert</h2>
                    <p className="mt-0.5 text-foreground/70 text-xs">Modify your marketplace listing</p>
                </div>
                <button onClick={onClose} className="flex justify-center items-center bg-destructive/10 hover:bg-destructive rounded-md size-6 md:size-7 xl:size-8 text-destructive hover:text-destructive-foreground transition-colors cursor-pointer">
                    <CloseSquare className="size-3 md:size-3.5 xl:size-4" />
                </button>
            </header>

            {/* Form Wrapper */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 space-y-6 pr-2 overflow-y-auto custom-scrollbar">

                    <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                        {/* Title Field */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" placeholder="e.g. Vintage Leather Jacket" {...register("title")} className="bg-accent/5 rounded-lg" />
                            {errors.title && <ErrorText message={errors.title?.message} />}
                        </div>

                        {/* Average Price */}
                        <div className="space-y-2">
                            <Label htmlFor="averagePrice">Average Price (USD)</Label>
                            <Input id="averagePrice" type="number" min={1} placeholder="0" {...register("averagePrice", { valueAsNumber: true })} className="bg-accent/5 rounded-lg montserrat" />
                            {errors.averagePrice && <ErrorText message={errors.averagePrice?.message} />}
                        </div>

                        {/* Type Field */}
                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Select defaultValue={advert.type} onValueChange={(value: "good" | "service") => setValue("type", value, { shouldValidate: true, shouldDirty: true })}>
                                <SelectTrigger id="type" className="bg-accent/5 rounded-lg w-full">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="good">Good (Physical/Digital Item)</SelectItem>
                                    <SelectItem value="service">Service</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.type && <ErrorText message={errors.type?.message} />}
                        </div>

                        {/* Status Field */}
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select defaultValue={advert.status} onValueChange={(value: "active" | "paused" | "sold_out") => setValue("status", value, { shouldValidate: true, shouldDirty: true })}>
                                <SelectTrigger id="status" className="bg-accent/5 rounded-lg w-full">
                                    <SelectValue placeholder="Set status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active (Visible to everyone)</SelectItem>
                                    <SelectItem value="paused">Paused (Hidden temporarily)</SelectItem>
                                    <SelectItem value="sold_out">Sold Out</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && <ErrorText message={errors.status?.message} />}
                        </div>
                    </div>

                    {/* Description Field */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="description">Description</Label>
                            <span className={cn("font-medium text-[10px] md:text-[11px] transition-colors duration-300 montserrat", descriptionLength > 500 ? "text-destructive font-bold" : "text-muted-foreground")}>
                                {descriptionLength} <span className="opacity-70">/ 500</span>
                            </span>
                        </div>
                        <Textarea id="description" {...register("description")} placeholder="Describe your item or service in detail..." className={cn("bg-accent/5 rounded-lg h-40 transition-colors resize-none hide-scrollbar", descriptionLength > 500 && "border-destructive/50 focus-visible:ring-destructive/30")} />
                        {errors.description && <ErrorText message={errors.description?.message} />}
                    </div>

                    {/* Categories Field */}
                    <div className="space-y-4 pt-2">
                        <Label>Select up to 10 Categories</Label>
                        <CategorySelector selected={categories} onChange={setCategories} maxSelections={10} />
                    </div>

                    {/* Delete Images */}
                    <MediaGridEditor mediaUrls={currentMedia} onDelete={handleMediaDelete} disabled={updateAdvert.isPending || mediaUpdate.isPending} />

                    {/* Media Uploader */}
                    <div className="space-y-2 pt-2 pb-4">
                        <Label>Update Media (Optional)</Label>
                        <p className="text-foreground/50 text-xs">Select new files</p>
                        <FileUploader disabled={isSubmitting} value={files} multiple max={REMAINING_MEDIA} onChange={setFiles} />
                    </div>

                </div>

                {/* Sticky Footer for Actions */}
                <div className="flex justify-end gap-3 mt-4 pt-4 border-border/50 border-t shrink-0">
                    <Button type="button" onClick={onClose} className="bg-background hover:bg-destructive/10 rounded-xl hover:text-destructive text-xs transition-colors">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="shadow-md shadow-primary/20 px-6 rounded-xl text-xs">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 size-3.5 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </div>
            </form>
        </main>
    )
}

export default AdvertEdit;