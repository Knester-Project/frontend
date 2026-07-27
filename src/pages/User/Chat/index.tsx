import { Route } from '@/routes/_dashboard/messages';

// UIs
import Main from '@/components/Main';
import Conversations from './Conversations';
import Messages from './Messages';

export default function MessagesLayout() {

    const { username } = Route.useSearch();

    return (
        <Main>
            {username ? (
                <Messages username={username} />
            ) : (
                <Conversations />
            )}
        </Main>
    );
}