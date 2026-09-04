import { createFileRoute } from '@tanstack/react-router';

// UIs
import Settings from "@/pages/User/Settings";
import { APP_NAME } from '../__root';

export const Route = createFileRoute('/_dashboard/settings')({
    head: () => ({
        meta: [
            {
                title: `Your Feed | ${APP_NAME}`,
            },
        ],
    }),
    component: RouteComponent,
})

function RouteComponent() {
    return <Settings />
}
