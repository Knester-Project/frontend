import { createFileRoute } from '@tanstack/react-router';
import WaitList from "@/pages/WaitList";

export const Route = createFileRoute('/_auth/waitlist')({
  component: RouteComponent,
})

function RouteComponent() {
  return <WaitList />
}
