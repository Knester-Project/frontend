import { Outlet, createFileRoute } from '@tanstack/react-router';
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
