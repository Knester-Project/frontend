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
    const user: UserProfile = data.data;

    return (
        <Main>
            <Header
                profilePicture={user.profile?.profilePicture ?? "/default.svg"}
                isOnline={user.profile?.isOnline ?? true}
                username={user.username}
                bio={user.profile?.bio ?? "No Bio Yet"}
                isPremium={user.isPremium}
                isModerator={user.isModerator}
                isCore={user.isCore}
                circleMembers={user.profile?.circleMembers ?? 0}
                balance={user.profile?.balance ?? 0}
                isOwner={isOwner}
                isSuspended={user.isSuspended}
                circlesJoined={user.circlesJoined ?? 0}
                totalPosts={user.totalPosts ?? 0}
            />
        </Main>
    );
}