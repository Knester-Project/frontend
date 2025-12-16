import { createFileRoute } from '@tanstack/react-router';

// Components
import Safety from '@/pages/User/Safety';

export const Route = createFileRoute('/_dashboard/safety')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Safety />
}
