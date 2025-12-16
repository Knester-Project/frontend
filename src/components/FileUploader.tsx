import React, { useRef, useEffect, useState } from "react";
import { toast } from "react-fox-toast";

// Hooks
import { usePresignedUpload } from "@/Hooks/usePresignedUpload";

type Props = {
    kind: "profile" | "chat" | "post";
    multiple?: boolean;
    onUploaded?: (files: { publicUrl: string; key: string }[]) => void;
};

type SelectedItem = {
    file: File;
    previewUrl: string;
    type: "image" | "video";
    sizeMB: string;
    duration?: number;
};

export default function FileUploader({ kind, multiple = false, onUploaded }: Props) {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploadFiles, uploads, uploading, error } = usePresignedUpload();

    const [selected, setSelected] = useState<SelectedItem[]>([]);
    const dragIndex = useRef<number | null>(null);

    const allowedExts = [
        "jpg", "jpeg", "png", "gif", "webp",
        "mp4", "mov", "avi", "mkv", "webm",
    ];

    async function handleSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const next: SelectedItem[] = [];

        for (const file of files) {
            const ext = file.name.split(".").pop()?.toLowerCase();
            if (!ext || !allowedExts.includes(ext)) {
                toast.error("Only images and videos are allowed");
                return;
            }

            const previewUrl = URL.createObjectURL(file);
            const isVideo = file.type.startsWith("video/");

            next.push({
                file,
                previewUrl,
                type: isVideo ? "video" : "image",
                sizeMB: (file.size / (1024 * 1024)).toFixed(2) + " MB",
            });

            // Load video duration
            if (isVideo) {
                const video = document.createElement("video");
                video.src = previewUrl;
                video.onloadedmetadata = () => {
                    setSelected((prev) =>
                        prev.map((p) =>
                            p.previewUrl === previewUrl
                                ? { ...p, duration: Math.round(video.duration) }
                                : p
                        )
                    );
                };
            }
        }

        setSelected((prev) => (multiple ? [...prev, ...next] : next));
        e.target.value = "";
    }

    function removeItem(index: number) {
        setSelected((prev) => {
            URL.revokeObjectURL(prev[index].previewUrl);
            return prev.filter((_, i) => i !== index);
        });
    }

    function handleDragStart(index: number) {
        dragIndex.current = index;
    }

    function handleDrop(index: number) {
        if (dragIndex.current === null) return;

        setSelected((prev) => {
            const items = [...prev];
            const [moved] = items.splice(dragIndex.current!, 1);
            items.splice(index, 0, moved);
            return items;
        });

        dragIndex.current = null;
    }

    async function handleUpload() {
        if (!selected.length) return;

        try {
            const files = selected.map((s) => s.file);
            const result = await uploadFiles(files, kind);

            onUploaded?.(
                result.map((r) => ({
                    publicUrl: r.publicUrl,
                    key: r.key,
                }))
            );

            cleanup();
        } catch {
            toast.error("Upload failed");
        }
    }

    function cleanup() {
        selected.forEach((s) => URL.revokeObjectURL(s.previewUrl));
        setSelected([]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => cleanup, []);

    return (
        <div className="space-y-4 bg-accent/20 dark:bg-accent/5 p-4 border rounded-xl w-full">

            {/* Select */}
            <button className="bg-primary px-4 py-2 rounded-lg w-full text-primary-foreground cursor-pointer" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                Select Pictures and/or Videos
            </button>

            <input ref={fileInputRef} type="file" multiple={multiple} accept="image/*,video/*" className="hidden" onChange={handleSelectFile} />

            {/* Preview Grid */}
            {selected.length > 0 && (
                <>
                    <div className="gap-2 grid grid-cols-3">
                        {selected.map((item, i) => (
                            <div key={i} draggable onDragStart={() => handleDragStart(i)} onDragOver={(e) => e.preventDefault()} onDrop={() => handleDrop(i)} className="group relative bg-black border rounded aspect-square overflow-hidden cursor-move">
                                {item.type === "image" ? (
                                    <img src={item.previewUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <video src={item.previewUrl} className="w-full h-full object-cover" muted playsInline />
                                )}

                                {/* Remove button */}
                                <button type="button" onClick={() => removeItem(i)} className="top-1 right-1 absolute flex justify-center items-center bg-destructive opacity-0 group-hover:opacity-100 rounded-full size-6 text-destructive-foreground text-xs cursor-pointer">
                                    ✕
                                </button>

                                {/* Size badge */}
                                <div className="bottom-1 left-1 absolute bg-black/70 px-1 rounded text-[10px] text-white">
                                    {item.sizeMB}
                                </div>

                                {/* Duration badge */}
                                {item.duration && (
                                    <div className="right-1 bottom-1 absolute bg-black/70 px-1 rounded text-[10px] text-white">
                                        {item.duration}s
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Upload */}
                    <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg w-full text-white" onClick={handleUpload} disabled={uploading}>
                        {uploading ? "Uploading..." : "Upload"}
                    </button>
                </>
            )}

            {/* Progress */}
            {uploads.map((u, i) => (
                <div key={i} className="space-y-1">
                    <div className="text-xs truncate">{u.file.name}</div>
                    <div className="bg-gray-200 rounded h-2">
                        <div className="bg-blue-600 rounded h-2 transition-all" style={{ width: `${u.progress}%` }} />
                    </div>
                    <div className="text-muted-foreground text-xs">{u.status}</div>
                </div>
            ))}

            {error && (
                <div className="text-[11px] text-destructive md:text-xs xl:text-sm">
                    {error}
                </div>
            )}
        </div>
    );
}
