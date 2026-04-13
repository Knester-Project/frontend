// Stores
import { useProfileTheme } from "@/stores/profileTheme.store";

// UIs
import MediaGallery from "./MediaGallery";

// Icons
import { Image, TagUser, ShieldSecurity, Gallery } from "iconsax-reactjs";

type bodyProps = {
    media: string[];
    isOwner: boolean;
    username: string;
}

const Body = ({ media, isOwner, username }: bodyProps) => {

    const { colors } = useProfileTheme();


    return (
        <main className="mx-auto py-8 max-w-7xl">
            <section>
                <div className="flex gap-x-1 text-sm md:text-base xl:text-lg items montserrat">
                    <Gallery variant="Bold" className="size-5 md:size-5.5 xl:size-6" style={{ color: colors.primary }} />
                    <p className="font-medium">Media</p>
                    <p>{media.length}</p>
                </div>
                <MediaGallery media={media} username={username} isOwner={isOwner} />
            </section>
        </main>
    );
}

export default Body;