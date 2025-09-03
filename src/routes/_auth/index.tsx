import { createFileRoute } from '@tanstack/react-router';
import Home from '@/pages/Home';

export const Route = createFileRoute('/_auth/')({
    
    validateSearch: (search: Record<string, unknown>) => ({
        invite: search.invite as string | undefined,
    }),
    component: RouteComponent,
});

function RouteComponent() {
    return <Home />;
}
