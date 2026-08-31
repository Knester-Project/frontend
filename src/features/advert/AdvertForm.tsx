import { useState } from "react";
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { sileo } from "sileo";

// Schemas, Services and utils
import { newAdvertSchema, type NewAdvertPayload } from "@/schemas/advert.schema";
import { useNewAdvert } from "@/services/userMutations";
import { usePresignedUpload } from "@/Hooks/usePresignedUpload";
import { areCategoriesValid } from "@/utils/format";
import { cn } from "@/lib/utils";

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
import CategorySelector from "./AdvertCategories";

// Icons
import { X, Loader2, Rocket } from "lucide-react";

const AdvertForm = ({ onClose }: { onClose: () => void; }) => {

    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [categories, setCategories] = useState<string[]>([]);

    // Added setValue so we can manually update custom Shadcn components like Select
    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } =
        useForm<NewAdvertPayload>({
            resolver: zodResolver(newAdvertSchema),
            mode: "onBlur",
            defaultValues: {
                type: "good",
                status: "active",
                description: ""
            }
        });

    // Actively watch the description field to get its current length
    const descriptionValue = watch("description") || "";
    const descriptionLength = descriptionValue.length;

    // Functions
    const onFileChange = (newFiles: File[]) => {
        setFiles(newFiles);
    };

    const { uploadFiles } = usePresignedUpload();

    const newAdvert = useNewAdvert();
    const onSubmit: SubmitHandler<NewAdvertPayload> = async (data) => {

        // Validate selected categories
        if (!categories.length) {
            sileo.error({ title: "Please select at least one category." });
            return;
        }

        if (!areCategoriesValid(categories)) {
            sileo.error({ title: "Please select valid categories." });
            return;
        }
        try {
            setIsUploading(true);

            // Validate files
            if (!files || files.length === 0) {
                sileo.error({ title: "Kindly select an image or a video that shows what you do." });
                return;
            }

            // Generate Presigned URL and Upload files
            const uploads = await uploadFiles(files, "post");

            // Attach uploaded media
            const media = uploads.map((u) => (u.publicUrl));

            setIsUploading(false);

            // Create Advert
            newAdvert.mutate({ ...data, categories, mediaUrls: media }, {
                onSuccess: () => {
                    sileo.success({ title: "Safety post created", icon: <Rocket className="size-3.5" />, });
                    setFiles([]);
                    onClose();
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onError: (error: any) => {
                    const message = error?.response?.data?.message || "Couldn't publish advert now, kindly try again later.";
                    sileo.error({ title: "Error", description: message });
                },
            });
        } catch {
            sileo.error({ title: "Couldn't publish advert now, kindly try again later." });
        } finally {
            reset();
            setCategories([]);
            setFiles([]);
            setIsUploading(false);
        }
    };

    return (
        <main className="flex flex-col h-full">
            {/* Header section */}
            <header className="flex justify-between items-center mb-6 shrink-0">
                <div>
                    <h2 className="font-bold text-sm md:text-base xl:text-lg">Create Advert</h2>
                    <p className="mt-0.5 text-foreground/70 text-xs">Add a new listing to the marketplace</p>
                </div>
                <button onClick={onClose} className="flex justify-center items-center bg-destructive/10 hover:bg-destructive rounded-md size-6 md:size-7 xl:size-8 text-destructive hover:text-destructive-foreground transition-colors cursor-pointer">
                    <X className="size-3 md:size-3.5 xl:size-4" />
                </button>
            </header>

            {/* Form Wrapper */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">

                {/* Scrollable area for the fields so the footer stays sticky */}
                <div className="flex-1 space-y-6 pr-2 overflow-y-auto custom-scrollbar">

                    {/* Modern Grid Layout Implementation */}
                    <div className="gap-6 grid grid-cols-1 md:grid-cols-2">

                        {/* Title Field (Spans both columns) */}
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
                            <Select defaultValue={"good"} onValueChange={(value: "good" | "service") => setValue("type", value, { shouldValidate: true })}>
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
                            <Select defaultValue={"active"}
                                onValueChange={(value: "active" | "paused" | "sold_out") => setValue("status", value, { shouldValidate: true })}>
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
                        {/* Label and Live Counter Header */}
                        <div className="flex justify-between items-center">
                            <Label htmlFor="description">Description</Label>

                            {/* Sleek Character Counter */}
                            <span className={cn(
                                "font-medium text-[10px] md:text-[11px] transition-colors duration-300 montserrat",
                                descriptionLength > 500 ? "text-destructive font-bold" : "text-muted-foreground"
                            )}>
                                {descriptionLength} <span className="opacity-70">/ 500</span>
                            </span>
                        </div>

                        {/* Textarea Input */}
                        <Textarea id="description"  {...register("description")}
                            placeholder="Describe your item or service in detail..."
                            className={cn(
                                "bg-accent/5 rounded-lg h-40 transition-colors resize-none hide-scrollbar",
                                descriptionLength > 500 && "border-destructive/50 focus-visible:ring-destructive/30"
                            )} />

                        {/* Error Message Display */}
                        {errors.description && <ErrorText message={errors.description?.message} />}
                    </div>

                    {/* Categories Field */}
                    <div className="space-y-4 pt-2">
                        <Label>Select up to 10 Categories</Label>
                        <CategorySelector selected={categories} onChange={setCategories} maxSelections={10} />
                    </div>

                    <div className="pt-2 pb-4">
                        <FileUploader disabled={newAdvert.isPending || isUploading} value={files} multiple max={5} onChange={onFileChange} />
                    </div>

                </div>

                {/* Sticky Footer for Actions */}
                <div className="flex justify-end gap-3 mt-4 pt-4 border-border/50 border-t shrink-0">
                    <Button type="button" variant="ghost" onClick={onClose} className="hover:bg-destructive/10 rounded-xl hover:text-destructive text-xs transition-colors">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={newAdvert.isPending || isUploading} className="shadow-md shadow-primary/20 px-6 rounded-xl text-xs">
                        {newAdvert.isPending || isUploading ? (
                            <>
                                <Loader2 className="mr-2 size-3.5 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Publish Advert"
                        )}
                    </Button>
                </div>

            </form>
        </main >
    );
};

export default AdvertForm;