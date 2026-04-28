import { createFileRoute } from '@tanstack/react-router';

// UIs
import People from "@/pages/User/People";

export const Route = createFileRoute('/_dashboard/people')({
  component: RouteComponent,
})

function RouteComponent() {
  return <People />
}
