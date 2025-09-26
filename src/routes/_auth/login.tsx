import { createFileRoute } from '@tanstack/react-router';

//Component
import Login from '@/pages/Login';

export const Route = createFileRoute('/_auth/login')({
    component: RouteComponent,
})

function RouteComponent() {
    return <Login />
}
