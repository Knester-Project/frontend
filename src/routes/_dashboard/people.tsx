import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/people')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dashboard/people"!</div>
}
