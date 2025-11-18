import { createFileRoute } from '@tanstack/react-router';

//Components
import Profile from '@/pages/User/Profile';

export const Route = createFileRoute('/_dashboard/profile')({
  validateSearch: (search: Record<string, unknown>) => ({
        profile: search.profile as string | undefined,
    }),
  component: RouteComponent,
})

function RouteComponent() {
  return <Profile />
}
