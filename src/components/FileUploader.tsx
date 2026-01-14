import React, { useRef, useEffect, useState } from "react";
import { toast } from "react-fox-toast";

type Props = {
    multiple?: boolean;
    disabled?: boolean;
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

export default function FileUploader({ multiple = false, disabled, value, onChange }: Props) {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const dragIndex = useRef<number | null>(null);

    const [items, setItems] = useState<SelectedItem[]>([]);

    const allowedExts = [
        "jpg", "jpeg", "png", "gif", "webp",
        "mp4", "mov", "avi", "mkv", "webm",
    ];

    // 🔁 Sync File[] → UI items
    useEffect(() => {
        const mapped: SelectedItem[] = value.map((file) => {
            const existing = items.find((i) => i.file === file);
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

        // cleanup removed previews
        items.forEach((i) => {
            if (!value.includes(i.file)) {
                URL.revokeObjectURL(i.previewUrl);
            }
        });

        setItems(mapped);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    function handleSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        for (const file of files) {
            const ext = file.name.split(".").pop()?.toLowerCase();
            if (!ext || !allowedExts.includes(ext)) {
                toast.error("Only images and videos are allowed");
                return;
            }
        }

        onChange(multiple ? [...value, ...files] : files);
        e.target.value = "";
    }

    function removeItem(index: number) {
        const updated = value.filter((_, i) => i !== index);
        onChange(updated);
    }

    function handleDragStart(index: number) {
        dragIndex.current = index;
    }

    function handleDrop(index: number) {
        if (dragIndex.current === null) return;

        const updated = [...value];
        const [moved] = updated.splice(dragIndex.current, 1);
        updated.splice(index, 0, moved);

        dragIndex.current = null;
        onChange(updated);
    }

    // cleanup on unmount
    useEffect(() => {
        return () => {
            items.forEach((i) => URL.revokeObjectURL(i.previewUrl));
        };
    }, [items]);

    return (
        <div className="space-y-4 bg-accent/20 dark:bg-accent/5 p-4 border rounded-xl">
            <button type="button" disabled={disabled} onClick={() => fileInputRef.current?.click()} className="bg-primary px-4 py-2 rounded w-full text-white cursor-pointer">
                Select Pictures and/or Videos
            </button>

            <input ref={fileInputRef} type="file" multiple={multiple} accept="image/*,video/*" className="hidden" onChange={handleSelectFile} />

            {items.length > 0 && (
                <div className="gap-2 grid grid-cols-3">
                    {items.map((item, i) => (
                        <div key={i} draggable onDragStart={() => handleDragStart(i)} onDragOver={(e) => e.preventDefault()} onDrop={() => handleDrop(i)} className="group relative bg-black border rounded aspect-square overflow-hidden cursor-move">
                            {item.type === "image" ? (
                                <img src={item.previewUrl} className="w-full h-full object-cover" />
                            ) : (
                                <video src={item.previewUrl} className="w-full h-full object-cover" muted playsInline />
                            )}

                            <button type="button" onClick={() => removeItem(i)} className="top-1 right-1 absolute bg-red-600 opacity-0 group-hover:opacity-100 rounded-full size-6 text-white text-xs cursor-pointer">
                                ✕
                            </button>

                            <div className="bottom-1 left-1 absolute bg-black/70 px-1 rounded text-[10px] text-white">
                                {item.sizeMB}
                            </div>

                            {item.duration && (
                                <div className="right-1 bottom-1 absolute bg-black/70 px-1 rounded text-[10px] text-white">
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
