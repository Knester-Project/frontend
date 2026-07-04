import { useSuspenseQuery } from '@tanstack/react-query';
import { Route } from '@/routes/_dashboard/profile';

// Services
import { userProfileOptions } from '@/services/userQueries';

// UIs
import Main from '@/components/Main';
import Header from './Header';
import Body from './Body';
import MyHeader from './MyHeader';
import MyBody from './MyBody';

export default function Index() {

    // Get search params from the route
    const { profile } = Route.useSearch();
    const isOwner = profile.trim() === "me";

    // useSuspenseQuery assumes the data is already being loaded by the loader
    const { data } = useSuspenseQuery(userProfileOptions(profile.trim()));
    const user = data.data;

    return (
        <Main>
            {isOwner ?
                <>
                    <MyHeader user={user} />
                    <MyBody user={user} />
                </>
                :
                <>
                    <Header user={user} />
                    <Body user={user} />
                </>
            }
        </Main>
    );
}