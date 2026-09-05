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
import { Loader, RefreshCw } from 'lucide-react';

export default function MessagesLayout() {

    const { username } = Route.useSearch();

    const { data, isLoading: isVaultLoading, isError: isVaultError } = useUserVault();
    const vault: EncryptedVault = data?.data || {};

    // null = Dexie is still checking
    // undefined = Dexie checked and no identity exists
    // Identity = identity exists
    const localIdentity = useLiveQuery(() => db.identity.get('me'), [], null);

    // Dexie is still reading from IndexedDB
    if (localIdentity === null) {
        return <VaultStatus type="loading" />;
    }

    // Dexie has finished reading, but the browser has no identity, happens when the user changes device/browser.
    if (localIdentity === undefined) {
        if (isVaultLoading) {
            return <VaultStatus type="loading" />;
        }

        if (isVaultError) {
            return <VaultStatus type="error" />;
        }

        return (
            <Main>
                <VaultSync mode="restore" userEncryptedVault={vault} />
            </Main>
        );
    }

    // We have local keys, but the server doesn't have the vault.
    if (!isVaultLoading && !isVaultError && Object.keys(vault).length === 0) {
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

interface VaultStatusProps {
    type: "loading" | "error";
}

function VaultStatus({ type }: VaultStatusProps) {
    const isLoading = type === "loading";

    return (
        <Main>
            <div className="flex flex-col justify-center items-center gap-2 h-[80vh]">
                {isLoading ? (
                    <Loader className="size-6 md:size-7 xl:size-8 text-primary animate-spin" />
                ) : (
                    <RefreshCw className="size-6 md:size-7 xl:size-8 text-primary" />
                )}

                <p className="text-center smallText">
                    {isLoading ? "Loading your encrypted vault..." : "Couldn't load your encrypted vault. Please try again."}
                </p>
            </div>
        </Main>
    );
}