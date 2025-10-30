import { Outlet, createFileRoute } from '@tanstack/react-router';

//Layouts
import AuthLayout from '@/layouts/AuthLayout';

export const Route = createFileRoute('/_auth')({
  component: AuthLayoutWrapper,
})

function AuthLayoutWrapper() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
