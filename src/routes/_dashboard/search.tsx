import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/search')({

  validateSearch: (search: Record<string, string>) => ({
    tags: search.tags as string,
  }),

  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dashboard/search"!</div>
}
