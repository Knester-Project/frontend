import { createFileRoute } from '@tanstack/react-router';

//Components
import Feed from '@/pages/User/Feed';

export const Route = createFileRoute('/_dashboard/feed')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Feed />
}
