import { useSuspenseQuery } from '@tanstack/react-query';
import { Route } from '@/routes/_dashboard/profile';

// Services
import { userProfileOptions } from '@/services/userQueries';

// UIs
import Main from '@/components/Main';
import Header from './Header';

export default function Index() {

    // Get search params from the route
    const { profile } = Route.useSearch();
    const isOwner = profile.trim() === "me";

    // useSuspenseQuery assumes the data is already being loaded by the loader
    const { data } = useSuspenseQuery(userProfileOptions(profile.trim()));
    const user: Me | UserDetails = data.data;

    const relationshipDefault = {
        inCircle: false,
        hasReported: false,
        hasBlocked: false,
        isBlocked: false,
    }
    return (
        <Main>
            <Header
                profilePicture={user.profile?.profilePicture ?? "/default.svg"}
                isOnline={user.profile?.isOnline ?? true}
                username={user.username}
                bio={user.profile?.bio ?? ""}
                isPremium={user.isPremium}
                isModerator={user.isModerator}
                isCore={user.isCore}
                circleMembers={user.profile?.circleMembers ?? 0}
                balance={('balance' in user) ? (user.balance as number) : 0}
                isOwner={isOwner}
                isSuspended={user.isSuspended}
                circlesJoined={('circlesJoined' in user) ? user.circlesJoined : 0}
                totalPosts={('totalPosts' in user) ? user.totalPosts : 0}
                details={user.profile?.details ?? []}
                relationship={('relationship' in user) ? user.relationship : relationshipDefault}
                mediaLength={user.profile?.media?.length ?? 0}
                dateOfBirth={user.profile?.dateOfBirth ?? ""}
                profileLock={user.profile?.profileLock ?? false}
                chatLock={user.profile?.chatLock ?? false}
            />
        </Main>
    );
}