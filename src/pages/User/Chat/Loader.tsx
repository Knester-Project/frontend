import { Route } from '@/routes/_dashboard/messages';

// UIs
import ConversationLoader from './Conversations/Loading';

// Icons
import { Refresh } from "iconsax-reactjs";

export default function Loader() {
    const { username } = Route.useSearch();

    if (username) {
        return <MessageLoader text={`Loading conversation with ${username}…`} />;
    }

    return <ConversationLoader />;
}

function MessageLoader({ text = "Loading Messages..." }: { text?: string }) {
    return (
        <div className="flex flex-col justify-center items-center gap-4 h-dvh">
            <Refresh className="size-6 md:size-7 xl:size-8 text-primary animate-spin" />
            <p className="text-[11px] text-foreground/70 md:text-xs xl:text-sm">
                {text}
            </p>
        </div>
    );
}