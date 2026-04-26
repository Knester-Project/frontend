import { Link } from "@tanstack/react-router";

// Stores
import { useProfileTheme } from "@/stores/profileTheme.store";

// UIs
import MediaGallery from "./MediaGallery";
import AccountStatus from "./AccountStatus";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Cobweb from "@/components/Cobweb";

// Icons
import { TagUser, ShieldSecurity, Gallery, Slash, MedalStar, Crown1, Star1 } from "iconsax-reactjs";

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
    email: string;
    createdAt: string;
}

const Body = ({
    media, isOwner, username, invitedUser, isEmailVerified, profileLock, chatLock,
    flagged, isSuspended, referralPrivilege, dateOfBirth, email, createdAt
}: bodyProps) => {

    const { colors } = useProfileTheme();


    return (
        <main className="mx-auto max-w-7xl">
            <section className="mt-8">
                <div className="flex gap-x-1 text-sm md:text-base xl:text-lg items montserrat">
                    <Gallery variant="Bold" className="size-5 md:size-5.5 xl:size-6" style={{ color: colors.primary }} />
                    <p className="font-medium">Media</p>
                    <p className="font-bold">{media.length}</p>
                </div>
                {media.length > 0 ?
                    <MediaGallery media={media} username={username} isOwner={isOwner} />
                    :
                    <div className="flex flex-col items-center gap-y-2 my-4">
                        <Cobweb color={colors.primary} />
                        <p style={{ color: colors.primary }} className="capitalize montserrat">{username}'s Cobweb-filled media shelf.</p>
                    </div>
                }
            </section>
            {isOwner &&
                <section className="mt-8">
                    <div className="flex gap-x-1 text-sm md:text-base xl:text-lg items montserrat">
                        <TagUser variant="Bold" className="size-5 md:size-5.5 xl:size-6" style={{ color: colors.primary }} />
                        <p className="font-medium">Invited Users</p>
                        <p className="font-bold"><span style={{ color: colors.primary }}>{invitedUser.length}</span>/{referralPrivilege}</p>
                    </div>
                    {invitedUser.length > 0 ? (
                        invitedUser.map((user) => (
                            <Link style={{ backgroundColor: colors.primary + 20 }} to="/profile" search={{ profile: user.username }} key={user._id} className="flex items-center gap-x-2 my-4 p-2 md:p-3 xl:p-4 border border-border rounded-2xl">
                                <Avatar>
                                    <AvatarImage src={user.profile?.profilePicture || "/default.svg"} />
                                    <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p style={{ color: colors.primary }} className="font-medium text-base md:text-lg xl:text-xl">{user.username}</p>
                                    {user.isCore && <Badge className="bg-core/10 -mt-1 border-core text-core"><MedalStar variant="Bold" /> Core Member</Badge>}
                                    {user.isPremium && <Badge className="bg-premium/10 -mt-1 border-premium text-premium"><Crown1 variant="Bold" /> Premium Member</Badge>}
                                    {user.isModerator && <Badge className="bg-moderator/10 -mt-1 border-moderator text-moderator"><Star1 variant="Bold" /> Moderator</Badge>}
                                    {user.isSuspended &&
                                        <Badge variant="destructive" className='-mt-1'>
                                            <Slash /> Suspended
                                        </Badge>
                                    }
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="flex flex-col items-center gap-y-2 my-4">
                            <Cobweb color={colors.primary} />
                            <p style={{ color: colors.primary }}>No invited users yet.</p>
                        </div>
                    )}
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
                    email={email}
                    createdAt={createdAt}
                />
            </section>
        </main>
    );
}

export default Body;