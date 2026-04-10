// Icons
import { ShieldTick, Lock, UserTag, Verify } from "iconsax-reactjs";

export const ProfileCard = ({ user }: { user: User }) => {

    const profile = user.profile;

    return (
        <div className="flex items-center gap-3 bg-card shadow-sm p-4 border rounded-2xl w-full text-card-foreground">

            {/* Avatar */}
            <div className="relative">
                {profile?.profilePicture ? (
                    <img src={profile.profilePicture} alt={user.username} className="border rounded-full size-12 object-cover" />
                ) : (
                    <div className="flex justify-center items-center bg-muted rounded-full size-12">
                        <UserTag className="size-5 text-muted-foreground" />
                    </div>
                )}

                {/* Profile lock */}
                {profile?.profileLock && (
                    <div className="-right-1 -bottom-1 absolute bg-background p-1 border rounded-full">
                        <Lock className="size-3 text-muted-foreground" />
                    </div>
                )}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm truncate">{user.username}</p>

                    {/* Badges */}
                    <div className="flex items-center gap-1">
                        {user.isPremium && (
                            <Verify className="size-3.5 text-premium" />
                        )}
                        {user.isModerator && (
                            <ShieldTick className="size-3.5 text-moderator" />
                        )}
                        {user.isCore && (
                            <ShieldTick className="size-3.5 text-core" />
                        )}
                    </div>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 mt-1 text-muted-foreground text-xs">
                    {profile && (
                        <span>{profile.circleMembers} in circle</span>
                    )}

                    {profile?.chatLock && (
                        <span className="flex items-center gap-1">
                            <Lock className="size-3" />
                            Chat locked
                        </span>
                    )}
                </div>
            </div>

            {/* Status */}
            {user.isSuspended && (
                <span className="font-medium text-destructive text-xs">
                    Suspended
                </span>
            )}
        </div>
    );
};