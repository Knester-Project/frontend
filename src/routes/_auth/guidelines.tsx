import { createFileRoute } from '@tanstack/react-router';

// UIs
import Guidelines from "@/pages/Guidelines";

import { APP_NAME } from '../__root';

export const Route = createFileRoute('/_auth/guidelines')({
    head: () => ({
        meta: [
            {
                title: `Guidelines | ${APP_NAME}`,
            },
        ],
    }),
    component: RouteComponent,
})

function RouteComponent() {
    return <Guidelines />
}
