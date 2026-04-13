// Stores
import { useProfileTheme } from "@/stores/profileTheme.store";

// UIs
import MediaGallery from "./MediaGallery";
import AccountStatus from "./AccountStatus";

// Icons
import { TagUser, ShieldSecurity, Gallery } from "iconsax-reactjs";

type bodyProps = {
    media: string[];
    isOwner: boolean;
    username: string;
    invitedUser: User[];
    isEmailVerified: boolean;
    profileLock: boolean;
    chatLock: boolean;
    flagged: boolean;
    isSuspended: boolean;
    referralPrivilege: number;
    dateOfBirth: string;
}

const Body = ({
    media, isOwner, username, invitedUser, isEmailVerified, profileLock, chatLock,
    flagged, isSuspended, referralPrivilege, dateOfBirth
}: bodyProps) => {

    const { colors } = useProfileTheme();


    return (
        <main className="mx-auto max-w-7xl">
            <section className="mt-8">
                <div className="flex gap-x-1 text-sm md:text-base xl:text-lg items montserrat">
                    <Gallery variant="Bold" className="size-5 md:size-5.5 xl:size-6" style={{ color: colors.primary }} />
                    <p className="font-medium">Media</p>
                    <p>{media.length}</p>
                </div>
                <MediaGallery media={media} username={username} isOwner={isOwner} />
            </section>
            {isOwner &&
                <section className="mt-8">
                    <div className="flex gap-x-1 text-sm md:text-base xl:text-lg items montserrat">
                        <TagUser variant="Bold" className="size-5 md:size-5.5 xl:size-6" style={{ color: colors.primary }} />
                        <p className="font-medium">Invited Users</p>
                        <p>{invitedUser.length}</p>
                    </div>
                </section>
            }
            <section className="mt-8">
                <div className="flex gap-x-1 text-sm md:text-base xl:text-lg items montserrat">
                    <ShieldSecurity variant="Bold" className="size-5 md:size-5.5 xl:size-6" style={{ color: colors.primary }} />
                    <p className="font-medium">{isOwner ? "Account Status" : "Account Summary"}</p>
                </div>
                <AccountStatus
                    isEmailVerified={isEmailVerified}
                    profileLock={profileLock}
                    chatLock={chatLock}
                    flagged={flagged}
                    isSuspended={isSuspended}
                    referralPrivilege={referralPrivilege}
                    isOwner={isOwner}
                    dateOfBirth={dateOfBirth}
                />
            </section>
        </main>
    );
}

export default Body;