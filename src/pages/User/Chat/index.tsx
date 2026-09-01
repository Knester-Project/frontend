import { Route } from '@/routes/_dashboard/messages';
import { useLiveQuery } from 'dexie-react-hooks';

// Services, Utils
import { useUserVault } from '@/services/userQueries';
import { db } from '@/lib/db';

// UIs
import Main from '@/components/layouts/Main';
import Conversations from './Conversations';
import Messages from './Messages';
import VaultSync from '@/features/messages/VaultSync';

// Icons
import { Loader } from 'lucide-react';

export default function MessagesLayout() {

    const { username } = Route.useSearch();
    const { data, isLoading, isError } = useUserVault();
    const vault: EncryptedVault = data?.data || {}

    const isBusy = isLoading || isError;


    // Check Dexie for the local identity keys
    const localIdentity = useLiveQuery(() => db.identity.get("me"));

    // Handle the microsecond where Dexie is reading from the disk
    if (localIdentity === undefined) {
        return (
            <Main>
                <div className="flex flex-col justify-center items-center h-full min-h-[50vh]">
                    <Loader className="size-6 md:size-7 xl:size-8 text-primary animate-spin" />
                    <p className='text-center smallText'>Loading...</p>
                </div>
            </Main>
        );
    }

    // The user has no keys in this browser's Dexie DB
    if (!localIdentity) {
        return (
            <Main>
                <VaultSync mode="restore" userEncryptedVault={vault} />
            </Main >
        )
    }

    // The user has local keys, but the server doesn't know about them
    if (localIdentity && !isBusy && Object.keys(vault).length === 0) {
        return (
            <Main>
                <VaultSync mode="sync" />
            </Main>
        );
    }

    return (
        <main>
            {username ? (
                <Messages username={username} />
            ) : (
                <Conversations />
            )}
        </main>
    );
}