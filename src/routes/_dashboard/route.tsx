import { Outlet, createFileRoute } from '@tanstack/react-router';

//Layouts
import DashboardLayout from '@/layouts/DashboardLayout';

export const Route = createFileRoute('/_dashboard')({
    component: DashboardLayoutWrapper,
})

function DashboardLayoutWrapper() {
    return (
        <DashboardLayout>
            <Outlet />
        </DashboardLayout>
    );
}