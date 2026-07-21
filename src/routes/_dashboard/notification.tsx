import { createFileRoute } from '@tanstack/react-router';

// UIs
import Notification from "@/pages/User/Notification";

import { APP_NAME } from '../__root';


export const Route = createFileRoute('/_dashboard/notification')({

    head: () => ({
        meta: [
            {
                title: `Notification | ${APP_NAME}`,
            },
        ],
    }),

    component: RouteComponent,
})

function RouteComponent() {
    return <Notification />
}
