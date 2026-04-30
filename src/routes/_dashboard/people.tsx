import { createFileRoute } from '@tanstack/react-router';

// UIs
import People from "@/pages/User/People";

export const Route = createFileRoute('/_dashboard/people')({

  validateSearch: (search: Record<string, string>) => ({
    mode: search.mode as string,
  }),

  component: RouteComponent,
})

function RouteComponent() {
  return <People />
}
