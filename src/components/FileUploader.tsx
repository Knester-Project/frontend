// /components/FileUploader.tsx
import React, { useRef, useEffect, useState } from "react";
import { sileo } from "sileo";

// Utils
import { makeFilesUnique } from "@/utils/format";

// Icons
import { GalleryAdd } from "iconsax-reactjs";

type Props = {
    multiple?: boolean;
    disabled?: boolean;
    max?: number;
    value: File[];
    onChange: (files: File[]) => void;
};

type SelectedItem = {
    file: File;
    previewUrl: string;
    type: "image" | "video";
    sizeMB: string;
    duration?: number;
};

export default function FileUploader({ multiple = false, disabled, max = 8, value, onChange }: Props) {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [items, setItems] = useState<SelectedItem[]>([]);

    const allowedExts = [
        "jpg", "jpeg", "png", "gif", "webp", "heic", "heif",
        "mp4", "mov", "avi", "mkv", "webm", "m4v",
    ];

    const MAX_FILE_SIZE_MB = 50;

    // Sync File[] → UI items
    useEffect(() => {
        setItems((prev) => {
            const mapped: SelectedItem[] = value.map((file) => {
                const existing = prev.find((i) => i.file === file);
                if (existing) return existing;

                const previewUrl = URL.createObjectURL(file);
                const isVideo = file.type.startsWith("video/");

                return {
                    file,
                    previewUrl,
                    type: isVideo ? "video" : "image",
                    sizeMB: (file.size / (1024 * 1024)).toFixed(2) + " MB",
                };
            });

            // cleanup removed
            prev.forEach((i) => {
                if (!value.includes(i.file)) {
                    URL.revokeObjectURL(i.previewUrl);
                }
            });

            return mapped;
        });
    }, [value]);

    function isDuplicate(file: File) {
        return value.some(
            (f) => f.name === file.name && f.size === file.size
        );
    }

    function validateFiles(files: File[]) {
        for (const file of files) {
            const ext = file.name.split(".").pop()?.toLowerCase();

            if (!ext || !allowedExts.includes(ext)) {
                sileo.error({ title: "Invalid file type" });
                return false;
            }

            if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
                sileo.error({ title: "Unsupported MIME type" });
                return false;
            }

            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                sileo.error({ title: `File exceeds ${MAX_FILE_SIZE_MB}MB` });
                return false;
            }

            if (isDuplicate(file)) {
                sileo.error({ title: "Duplicate file detected" });
                return false;
            }
        }
        return true;
    }

    function handleSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
        const incomingFiles = Array.from(e.target.files || []);
        if (!incomingFiles.length) return;

        if (!validateFiles(incomingFiles)) return;

        const currentCount = value.length;
        const availableSlots = max - currentCount;

        if (multiple && availableSlots <= 0) {
            sileo.error({ title: `Maximum of ${max} files allowed` });
            return;
        }

        const allowedIncoming = multiple
            ? incomingFiles.slice(0, availableSlots)
            : incomingFiles.slice(0, 1);

        const uniqueFiles = makeFilesUnique(allowedIncoming);

        onChange(multiple ? [...value, ...uniqueFiles] : uniqueFiles);

        e.target.value = "";
    }

    function removeItem(index: number) {
        onChange(value.filter((_, i) => i !== index));
    }

    // cleanup
    useEffect(() => {
        return () => {
            items.forEach((i) => URL.revokeObjectURL(i.previewUrl));
        };
    }, [items]);

    return (
        <div className="space-y-4 bg-accent/20 dark:bg-accent/5 p-4 border rounded-xl">
            {/* Button */}
            <button type="button" disabled={disabled} onClick={() => fileInputRef.current?.click()}
                className="group relative flex flex-col justify-center items-center gap-1 bg-gradient-to-br from-primary hover:from-primary/90 to-primary/70 hover:to-primary disabled:opacity-50 px-4 py-4 rounded-xl w-full text-primary-foreground duration-200 cursor-pointer disabled:cursor-not-allowed">
                <GalleryAdd className="size-6 group-hover:scale-110 transition" variant="Bold" />

                <span className="font-medium text-[11px] md:text-xs xl:text-sm">
                    Upload Media
                </span>

                <span className="opacity-80 text-[10px] md:text-[11px] text-xs montserrat">
                    {value.length}/{max} selected
                </span>
            </button>

            <input ref={fileInputRef} type="file" multiple={multiple} accept="image/*,video/*"
                className="hidden" onChange={handleSelectFile} />

            {/* Empty state */}
            {items.length === 0 && (
                <p className="text-[10px] text-muted-foreground md:text-[11px] text-xs text-center">
                    No files selected. Supported: images & videos.
                </p>
            )}

            {/* Grid */}
            {items.length > 0 && (
                <div className="gap-2 grid grid-cols-3">
                    {items.map((item, i) => (
                        <div key={i} className="group relative bg-black border rounded aspect-square overflow-hidden cursor-move">
                            {item.type === "image" ? (
                                <img src={item.previewUrl} className="w-full h-full object-cover" />
                            ) : (
                                <video src={item.previewUrl} className="w-full h-full object-cover" muted playsInline />
                            )}

                            <button type="button" onClick={() => removeItem(i)}
                                className="top-1 right-1 absolute bg-red-600 opacity-0 group-hover:opacity-100 rounded-full size-6 text-[11px] text-white md:text-xs xl:text-sm">
                                ✕
                            </button>

                            <div className="bottom-1 left-1 absolute bg-black/70 px-1 rounded text-[10px] text-white md:text-[11px] text-xs">
                                {item.sizeMB}
                            </div>

                            {item.duration && (
                                <div className="right-1 bottom-1 absolute bg-black/70 px-1 rounded text-[10px] text-white md:text-[11px] text-xs">
                                    {item.duration}s
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}