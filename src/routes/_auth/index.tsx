import { createFileRoute } from '@tanstack/react-router';

// UIs
import Home from '@/pages/Home';

import { APP_NAME } from '../__root';

export const Route = createFileRoute('/_auth/')({

    head: () => ({
        meta: [
            {
                title: `Home | ${APP_NAME}`,
            },
        ],
    }),

    validateSearch: (search: Record<string, unknown>) => ({
        invite: search.invite as string | undefined,
    }),
    component: RouteComponent,
});

function RouteComponent() {
    return <Home />;
}
