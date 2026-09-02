import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/messages')({
    component: RouteComponent,
});

function RouteComponent() {
    return <Outlet />;
}
