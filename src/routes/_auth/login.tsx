import { createFileRoute } from '@tanstack/react-router';

// UIs
import Login from '@/pages/Login';

import { APP_NAME } from '../__root';

export const Route = createFileRoute('/_auth/login')({
    head: () => ({
        meta: [
            {
                title: `Login | ${APP_NAME}`,
            },
        ],
    }),

    component: RouteComponent,
})

function RouteComponent() {
    return <Login />
}
