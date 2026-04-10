import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/messages')({

  validateSearch: (search: Record<string, string | undefined>) => ({
    username: search.username as string | undefined,
  }),

  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dashboard/messages"!</div>
}
