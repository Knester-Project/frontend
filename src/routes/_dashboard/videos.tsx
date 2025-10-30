import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/videos')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dashboard/videos"!</div>
}
