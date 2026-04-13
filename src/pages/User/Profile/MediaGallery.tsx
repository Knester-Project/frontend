import MediaViewer from "./MediaViewer";

interface MediaGalleryProps {
    media: string[];
    username: string;
    isOwner?: boolean;
}

export default function MediaGallery({ media, username, isOwner }: MediaGalleryProps) {


    return (
        <div className="py-4 w-full">
            <div className="gap-3 space-y-3 columns-3 md:columns-4 xl:columns-5">
                {media.map((url) => (
                    <div key={url} className="break-inside-avoid">
                        <MediaViewer
                            src={url}
                            alt={`${username}'s media`}
                            isOwner={isOwner}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}